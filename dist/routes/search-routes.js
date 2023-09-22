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
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
exports.router = (0, express_1.Router)();
exports.router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fs_1.default.readFileSync('./MIDI_sample.mid');
    // Set the Content-Type header to 'audio/midi'
    res.setHeader('Content-Type', 'audio/midi');
    // Send the MIDI data as a binary buffer
    res.send(data);
}));
//# sourceMappingURL=search-routes.js.map