"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.updateKey = exports.getUserByClerckId = exports.countUsage = exports.create = void 0;
const mongoose = __importStar(require("mongoose"));
const user_1 = require("../models/user");
const User = mongoose.model('User', user_1.UserSchema);
function create(user) {
    const newUser = new User(user);
    return newUser.save();
}
exports.create = create;
function countUsage(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield User.findOne({ clerkUserId: userId }).exec();
        if (!user) {
            yield create({ clerkUserId: userId, usageCount: 1 });
        }
        else {
            user.usageCount = user.usageCount + 1;
            yield user.save();
        }
    });
}
exports.countUsage = countUsage;
function getUserByClerckId(clerkUserId) {
    return User.findOne({ clerkUserId: clerkUserId }).exec();
}
exports.getUserByClerckId = getUserByClerckId;
function updateKey(userId, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ clerkUserId: userId }).exec();
        user.key = key;
        yield user.save();
    });
}
exports.updateKey = updateKey;
//# sourceMappingURL=user-controller.js.map