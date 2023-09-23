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
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const user_controller_1 = require("../controllers/user-controller");
exports.router = (0, express_1.Router)();
exports.router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_controller_1.create)(req.body);
    return res.status(200).send();
}));
exports.router.post('/key', (0, clerk_sdk_node_1.ClerkExpressRequireAuth)({}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_controller_1.updateKey)(req.auth.userId, req.body.key);
    return res.status(200).send();
}));
//# sourceMappingURL=user-routes.js.map