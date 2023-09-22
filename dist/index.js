"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const search_routes_1 = require("./routes/search-routes");
const user_routes_1 = require("./routes/user-routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.use('/users', user_routes_1.router);
app.use('/search', search_routes_1.router);
// start the Express server
app.listen(process.env.PORT, () => {
    mongoose_1.default.Promise = global.Promise;
    mongoose_1.default.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
    console.log(`server started at http://localhost:${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map