import express, { Request, Response } from "express";
const router = express.Router();
import groupController from "../controllers/group.controller";

router.post("/create", groupController.createGroup);
router.get("/history", groupController.getHistory);

export default router;
