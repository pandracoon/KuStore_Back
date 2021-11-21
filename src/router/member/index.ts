import { Router } from "express";
import { getMemberList, addMember, updateMember, deleteMember } from "./member";

const router = Router();

router.get("/", getMemberList);
router.post("/add", addMember);
router.post("/update", updateMember);
router.post("/delete", deleteMember);

export default router;
