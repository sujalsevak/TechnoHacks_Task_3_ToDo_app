import express from "express";
import {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
  editTask,
} from "./taskController.js";


const router = express.Router();

router.get("/",  getTasks);
router.post("/",  addTask);
router.patch("/:id", toggleTask);
router.put("/:id", editTask);
router.delete("/:id", deleteTask);

export default router;
