import express from "express";
import {
  createNote,
  deleteNote,
  updateNote,
  getNotes
} from "../Controllers/notecontroller.js";

import authMiddleware from '../middleware/authmiddleware.js'
const noteRouter = express.Router();

// 🔐 All routes protected
noteRouter.post("/create", authMiddleware, createNote);
noteRouter.get("/fetch", authMiddleware,  getNotes);
noteRouter.put("/edit/:id", authMiddleware, updateNote);
noteRouter.delete("/delete/:id", authMiddleware, deleteNote);

export default noteRouter;
