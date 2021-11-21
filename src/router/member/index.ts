import { Router } from "express";
import {
    getMemberList,
    addMember,
    updateMember,
    deleteMember,
    getMember,
} from "./member";

const router = Router();

router.get("/", getMemberList);
router.get("/search", getMemberList);
router.get("/detail", getMember);
router.post("/add", addMember);
router.post("/update", updateMember);
router.post("/delete", deleteMember);

export default router;
