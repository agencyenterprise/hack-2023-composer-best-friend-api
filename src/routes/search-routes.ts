import { Router } from 'express';
import fs from 'fs';

export const router = Router()

router.get('/',async (req, res) => {
  const data = await fs.readFileSync('./MIDI_sample.mid');
  // Set the Content-Type header to 'audio/midi'
  res.setHeader('Content-Type', 'audio/midi');

  // Send the MIDI data as a binary buffer
  res.send(data);
  
})