import { Router } from "express";
import { getInventoryList } from "./inventory";

const router = Router();

router.get("/", getInventoryList);

export default router;
