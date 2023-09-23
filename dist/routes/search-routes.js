"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
require("dotenv/config");
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const midi_writer_js_1 = __importDefault(require("midi-writer-js"));
const openai_1 = __importDefault(require("openai"));
const search_mocks_1 = __importDefault(require("./search-mocks"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
exports.router = (0, express_1.Router)();
function generateInitialVariations(query) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        // Ask OpenAI to create chord progressions for a song based on the input song
        const systemGuidelines = [
            'Create 4 chord progressions variations based on the input song.',
            'Response should be a json with this structure:',
            '[["Cmaj", "Gmaj", "Amin", "Emin"], ...]',
            'Do not return anything other than the JSON, otherwise the application will not work.',
        ];
        const completion = yield openai.chat.completions.create({
            model: `gpt-${process.env.GPT_MODEL}`,
            messages: [
                {
                    role: 'system',
                    content: systemGuidelines.join('\n'),
                },
                {
                    role: 'user',
                    content: query,
                }
            ],
        });
        const content = (_c = (_b = (_a = completion === null || completion === void 0 ? void 0 : completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!content) {
            throw new Error('No content found');
        }
        return JSON.parse(content);
    });
}
function generateMidiFiles(variations) {
    return __awaiter(this, void 0, void 0, function* () {
        const dateAsName = new Date().toISOString().replace(/:/g, '-');
        const midis = [];
        for (let i = 0; i < variations.length; i++) {
            const variation = variations[i];
            const track = new midi_writer_js_1.default.Track();
            for (const note of variation.notes) {
                const noteEvent = new midi_writer_js_1.default.NoteEvent(note);
                track.addEvent(noteEvent);
            }
            const write = new midi_writer_js_1.default.Writer(track);
            if (process.env.SIMULATE_GENERATION === 'true') {
                if (!fs_1.default.existsSync(`outputs/${dateAsName}`)) {
                    fs_1.default.mkdirSync(`outputs/${dateAsName}`, { recursive: true });
                }
                // Write file to disk
                fs_1.default.writeFile(`outputs/${dateAsName}/variation-${i + 1}.midi`, write.base64(), 'base64', function (err) {
                    console.log(err);
                });
            }
            midis.push(write);
        }
        return midis;
    });
}
function generateMidiPatterns(variations) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const systemGuidelines = [
            'Based on chord progressions from the user input, generate 5 variations of chord progressions that the user can use as inspiration.',
            'Choose a bpm that is close to original song asked by the user.',
            'Response should be a json with this structure:',
            '{ bpm: 120, variations: [ { notes: [ { pitch: ["C4"], duration: 1, velocity: 100 } ] } ] }',
            'The frontend of the app will use midi-writer-js to generate the midi files.',
            'midi-writer-js follows this structure for each track:',
            'new MidiWriter.NoteEvent({ pitch: ["E4", "D4"], duration: "4" }),',
            'Chords are represented like this:',
            '{ pitch: ["A4", "E4", "G4"] }',
            'Parameters are grace, pitch, duration, repeat, velocity and wait.',
            'Grace is the grace note to be applied to note event. Takes same value format as pitch. It is optional, you do not need to return it.',
            'Pitch is an array of strings that represent the notes that will be played - example: ["C4", "D4", "E4"].',
            'Duration should always be 1.',
            'Repeat is how many times the note should be repeated. It is optional, you do not need to return it.',
            'Velocity is how loud the note should sound, values 1-100.',
            'Wait is how long to wait before sounding note (rest). Takes same values as duration. It is optional, you do not need to return it.',
            'Do not return any additional text.',
            'Do not return anything other than the json, otherwise it will break the application.',
        ];
        const completion = yield openai.chat.completions.create({
            model: `gpt-${process.env.GPT_MODEL}`,
            messages: [
                {
                    role: 'system',
                    content: systemGuidelines.join('\n'),
                },
                {
                    role: 'user',
                    content: variations.join('\n'),
                }
            ],
        });
        const content = (_c = (_b = (_a = completion === null || completion === void 0 ? void 0 : completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!content) {
            throw new Error('No content found');
        }
        return JSON.parse(content);
    });
}
exports.router.get('/', /* ClerkExpressRequireAuth({}),*/ (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    // Activate that later
    // const { usageCount: countUsageTotal, key } = await getUserByClerckId(req.auth.userId);
    // if (countUsageTotal > 3 && !key) {
    //   return res.status(400).json({ error: 'Usage limit reached' });
    // }
    res.setHeader('Content-Type', 'audio/midi');
    try {
        // let midiPatterns = [];
        let midiFiles = [];
        if (process.env.SIMULATE_GENERATION !== 'true') {
            const chordVariations = yield generateInitialVariations(query);
            const midiResponse = yield generateMidiPatterns(chordVariations);
            console.log('midiResponse', midiResponse);
            midiFiles = yield generateMidiFiles(midiResponse.variations);
        }
        else {
            midiFiles = yield generateMidiFiles(search_mocks_1.default.variations);
        }
        return res.send(midiFiles);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            details: error,
            error: 'Something went wrong'
        });
    }
}));
//# sourceMappingURL=search-routes.js.map