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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
if (!process.env.JWT_SECRET) {
    throw new Error("Please set JWT_SECRET in .env file");
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "DELETE"],
}));
// Signup route
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        yield db_1.UserModel.create({ username, password });
        res.json({ message: "User created successfully" });
    }
    catch (err) {
        console.error("Error creating user:", err.message);
        res.status(400).json({ message: "User already exists" });
    }
}));
// Signin route
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUser = yield db_1.UserModel.findOne({ username, password });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ message: "User signed in successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid credentials" });
    }
}));
// Content creation route
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    if (!link || !type || !title) {
        res.status(400).json({ message: "Missing required fields: link, type, or title" });
        return;
    }
    try {
        yield db_1.ContentModel.create({
            link,
            type,
            title,
            userId: req.userId,
            tags: [],
        });
        res.json({ message: "Content added successfully" });
    }
    catch (err) {
        console.error("Error adding content:", err.message);
        res.status(500).json({ message: "Failed to add content" });
    }
}));
// Get content route
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const content = yield db_1.ContentModel.find({ userId: req.userId }).populate("userId", "username");
        res.json(content);
    }
    catch (err) {
        console.error("Error fetching content:", err.message);
        res.status(500).json({ message: "Failed to fetch content" });
    }
}));
// Delete content route
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.body; // Ensure contentId is typed correctly
    try {
        yield db_1.ContentModel.deleteMany({
            _id: contentId,
            userId: req.userId,
        });
        res.json({ message: "Content deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting content:", err.message);
        res.status(500).json({ message: "Failed to delete content" });
    }
}));
// Share brain route
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    try {
        if (share) {
            const existingLink = yield db_1.LinkModel.findOne({ userId: req.userId });
            if (existingLink) {
                res.status(400).json({
                    message: "Link already exists",
                    shareLink: `/api/v1/brain/share${existingLink.hash}`,
                });
                return;
            }
            const hash = (0, utils_1.random)(10);
            yield db_1.LinkModel.create({
                userId: req.userId,
                hash,
            });
            res.json({
                message: "Link shared successfully",
                shareLink: `/api/v1/brain/share${hash}`,
            });
        }
        else {
            yield db_1.LinkModel.deleteOne({ userId: req.userId });
            res.json({ message: "Link deleted successfully" });
        }
    }
    catch (err) {
        console.error("Error handling brain sharing:", err.message);
        res.status(500).json({ message: "Failed to handle brain sharing" });
    }
}));
// Get shared content
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shareLink: hash } = req.params;
    try {
        const link = yield db_1.LinkModel.findOne({ hash });
        if (!link) {
            res.status(404).json({ message: "Link not found" });
            return;
        }
        const content = yield db_1.ContentModel.findOne({ userId: link.userId });
        const user = yield db_1.UserModel.findOne({ _id: link.userId });
        res.json({ username: user === null || user === void 0 ? void 0 : user.username, content });
    }
    catch (err) {
        console.error("Error fetching shared content:", err.message);
        res.status(500).json({ message: "Failed to fetch shared content" });
    }
}));
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
