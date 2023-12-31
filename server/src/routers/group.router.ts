import express, { Request, Response } from "express";
const router = express.Router();
import groupController from "../controllers/group.controller";
import { checkGroupMember } from "../middlewares/authentication.middleware";

router.post("/create", groupController.createGroup);
router.post("/join", groupController.joinGroup);
router.get("/history", groupController.getHistory);
router.get("/members/:group_id",checkGroupMember, groupController.getMembers);
router.delete("/delete/:group_id", groupController.deleteGroup);

export default router;
