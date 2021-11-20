import { Router } from "express";

import main from "./root";

const router = Router();

router.get("/", main);
export default router;
