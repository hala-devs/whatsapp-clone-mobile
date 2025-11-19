import express from "express";
import { getMessages } from "../controllers/message.js";
const messageRouter = express.Router();

messageRouter.get("/", getMessages)

export default messageRouter;