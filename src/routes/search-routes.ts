import "dotenv/config";

import { Router } from "express";
import fs from "fs";
import MidiWriter from "midi-writer-js";
import OpenAI from "openai";

import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

import { countUsage, getUserByClerckId } from "../controllers/user-controller";

import mockedResponse from "./search-mocks";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const router = Router();

async function generateInitialVariations(query: string) {
  // Ask OpenAI to create chord progressions for a song based on the input song
  const systemGuidelines = [
    "Create 4 chord progressions variations based on the input song.",
    "Response should be a json with this structure:",
    '[["Cmaj", "Gmaj", "Amin", "Emin"], ...]',
    "Do not return anything other than the JSON, otherwise the application will not work.",
  ];

  const completion = await openai.chat.completions.create({
    model: `gpt-${process.env.GPT_MODEL}`,
    messages: [
      {
        role: "system",
        content: systemGuidelines.join("\n"),
      },
      {
        role: "user",
        content: query,
      },
    ],
  });

  const content = completion?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content found");
  }

  return JSON.parse(content);
}

async function generateMidiFiles(variations: Array<any>): Promise<Array<any>> {
  const isSimulated = process.env.SIMULATE_GENERATION === "true";
  const folderName = `${new Date().toISOString().replace(/:/g, "-")}${
    isSimulated ? "-simulated" : ""
  }`;
  const midis: any[] = [];

  for (let i = 0; i < variations.length; i++) {
    const variation = variations[i];
    const track = new MidiWriter.Track();

    for (const note of variation.notes) {
      const noteEvent = new MidiWriter.NoteEvent(note);

      track.addEvent(noteEvent);
    }

    const write = new MidiWriter.Writer(track);

    // if (!fs.existsSync(`outputs/${folderName}`)) {
    //   fs.mkdirSync(`outputs/${folderName}`, { recursive: true });
    // }

    // // Write file to disk
    // fs.writeFile(
    //   `outputs/${folderName}/variation-${i + 1}.midi`,
    //   write.base64(),
    //   "base64",
    //   function (err) {
    //     if (err) {
    //       console.log(err);
    //     }

    //     const file = fs.readFileSync(
    //       `outputs/${folderName}/variation-${i + 1}.midi`
    //     );

    //     midis.push(file);
    //   }
    // );

    // @ts-ignore
    const [_, midiData] = write.buildData();
    console.log({ midiData });
    midis.push(midiData.data);
  }

  return midis;
}

async function generateMidiPatterns(variations: Array<string>) {
  const systemGuidelines = [
    "Based on chord progressions from the user input, generate 5 variations of chord progressions that the user can use as inspiration.",
    "Choose a bpm that is close to original song asked by the user.",
    "Response should be a json with this structure:",
    '{ bpm: 120, variations: [ { notes: [ { pitch: ["C4"], duration: 1, velocity: 100 } ] } ] }',

    "The frontend of the app will use midi-writer-js to generate the midi files.",
    "midi-writer-js follows this structure for each track:",
    'new MidiWriter.NoteEvent({ pitch: ["E4", "D4"], duration: "4" }),',

    "Chords are represented like this:",
    '{ pitch: ["A4", "E4", "G4"] }',

    "Parameters are grace, pitch, duration, repeat, velocity and wait.",
    "Grace is the grace note to be applied to note event. Takes same value format as pitch. It is optional, you do not need to return it.",
    'Pitch is an array of strings that represent the notes that will be played - example: ["C4", "D4", "E4"].',
    "Duration should always be 1.",
    "Repeat is how many times the note should be repeated. It is optional, you do not need to return it.",
    "Velocity is how loud the note should sound, values 1-100.",
    "Wait is how long to wait before sounding note (rest). Takes same values as duration. It is optional, you do not need to return it.",

    "Do not return any additional text.",
    "Do not return anything other than the json, otherwise it will break the application.",
  ];

  const completion = await openai.chat.completions.create({
    model: `gpt-${process.env.GPT_MODEL}`,
    messages: [
      {
        role: "system",
        content: systemGuidelines.join("\n"),
      },
      {
        role: "user",
        content: variations.join("\n"),
      },
    ],
  });

  const content = completion?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content found");
  }

  return JSON.parse(content);
}

router.get(
  "/",
  /* ClerkExpressRequireAuth({}),*/ async (req, res) => {
    const { mode, query } = req.query;

    // Activate that later
    // const { usageCount: countUsageTotal, key } = await getUserByClerckId(req.auth.userId);

    // if (countUsageTotal > 3 && !key) {
    //   return res.status(400).json({ error: 'Usage limit reached' });
    // }

    res.setHeader("Content-Type", "audio/midi");

    if (mode === "presentation" || process.env.MODE === "presentation") {
      const folder =
        `${query}`.toLowerCase().indexOf("rem") > -1
          ? `./examples/rem`
          : "./examples/happy";

      console.log("Presentation mode, send all files from examples folder");

      fs.readdir(folder, (err, filesNames) => {
        if (err) {
          console.log("error", err);
          return res.status(500).json({ error: "Something went wrong" });
        }

        const files: any[] = [];

        for (const fileName of filesNames) {
          const file = fs.readFileSync(`${folder}/${fileName}`);
          files.push(file);
        }

        setTimeout(() => {
          return res.send(files);
        }, 10000);
      });

      // const data = await fs.readFileSync('./MIDI_sample.mid');
    } else {
      try {
        let midiFiles: any[] = [];

        if (process.env.SIMULATE_GENERATION !== "true") {
          const chordVariations = await generateInitialVariations(
            query as string
          );
          const midiResponse = await generateMidiPatterns(chordVariations);

          console.log("midiResponse", midiResponse);

          midiFiles = await generateMidiFiles(midiResponse.variations);
        } else {
          midiFiles = await generateMidiFiles(mockedResponse.variations);
        }

        return res.send(midiFiles);
      } catch (error) {
        console.log(error);

        return res.status(500).send({
          details: error,
          error: "Something went wrong",
        });
      }
    }
  }
);
