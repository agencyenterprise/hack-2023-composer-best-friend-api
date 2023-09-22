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
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const user_controller_1 = require("../controllers/user-controller");
exports.router = (0, express_1.Router)();
exports.router.get('/', (0, clerk_sdk_node_1.ClerkExpressRequireAuth)({}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fs_1.default.readFileSync('./MIDI_sample.mid');
    // Set the Content-Type header to 'audio/midi'
    res.setHeader('Content-Type', 'audio/midi');
    //TODO If request is ok we then will count usage
    if (true) {
        yield (0, user_controller_1.countUsage)(req.auth.userId);
    }
    return res.send(data);
}));
//# sourceMappingURL=search-routes.js.map