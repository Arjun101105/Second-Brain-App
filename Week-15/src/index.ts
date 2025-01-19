import express from "express";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "./middleware"; // Import the extended request type

if (!process.env.JWT_SECRET) {
  throw new Error("Please set JWT_SECRET in .env file");
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "DELETE"],
  })
);

// Signup route
app.post("/api/v1/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    await UserModel.create({ username, password });
    res.json({ message: "User created successfully" });
  } catch (err: unknown) {
    console.error("Error creating user:", (err as Error).message);
    res.status(400).json({ message: "User already exists" });
  }
});

// Signin route
app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const existingUser = await UserModel.findOne({ username, password });
  if (existingUser) {
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.json({ message: "User signed in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid credentials" });
  }
});

// Content creation route
app.post(
  "/api/v1/content",
  userMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { link, type, title } = req.body;

    if (!link || !type || !title) {
      res.status(400).json({ message: "Missing required fields: link, type, or title" });
      return;
    }

    try {
      await ContentModel.create({
        link,
        type,
        title,
        userId: req.userId,
        tags: [],
      });

      res.json({ message: "Content added successfully" });
    } catch (err: unknown) {
      console.error("Error adding content:", (err as Error).message);
      res.status(500).json({ message: "Failed to add content" });
    }
  }
);

// Get content route
app.get("/api/v1/content", userMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const content = await ContentModel.find({ userId: req.userId }).populate("userId", "username");
    res.json(content);
  } catch (err: unknown) {
    console.error("Error fetching content:", (err as Error).message);
    res.status(500).json({ message: "Failed to fetch content" });
  }
});

// Delete content route
app.delete("/api/v1/content", userMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { contentId } = req.body; // Ensure contentId is typed correctly

  try {
    await ContentModel.deleteMany({
      _id: contentId,
      userId: req.userId,
    });

    res.json({ message: "Content deleted successfully" });
  } catch (err: unknown) {
    console.error("Error deleting content:", (err as Error).message);
    res.status(500).json({ message: "Failed to delete content" });
  }
});

// Share brain route
app.post("/api/v1/brain/share", userMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { share } = req.body;
  try {
    if (share) {
      const existingLink = await LinkModel.findOne({ userId: req.userId });
      if (existingLink) {
        res.status(400).json({
          message: "Link already exists",
          shareLink: `/api/v1/brain/share${existingLink.hash}`,
        });
        return;
      }
      const hash = random(10);
      await LinkModel.create({
        userId: req.userId,
        hash,
      });
      res.json({
        message: "Link shared successfully",
        shareLink: `/api/v1/brain/share${hash}`,
      });
    } else {
      await LinkModel.deleteOne({ userId: req.userId });
      res.json({ message: "Link deleted successfully" });
    }
  } catch (err: unknown) {
    console.error("Error handling brain sharing:", (err as Error).message);
    res.status(500).json({ message: "Failed to handle brain sharing" });
  }
});

// Get shared content
app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
  const { shareLink: hash } = req.params;
  try {
    const link = await LinkModel.findOne({ hash });
    if (!link) {
      res.status(404).json({ message: "Link not found" });
      return;
    }
    const content = await ContentModel.findOne({ userId: link.userId });
    const user = await UserModel.findOne({ _id: link.userId });
    res.json({ username: user?.username, content });
  } catch (err: unknown) {
    console.error("Error fetching shared content:", (err as Error).message);
    res.status(500).json({ message: "Failed to fetch shared content" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
