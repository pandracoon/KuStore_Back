import { Router } from "express";
import { getMembershipList } from "./membership";

const router = Router();

router.get("/", getMembershipList);

export default router;
