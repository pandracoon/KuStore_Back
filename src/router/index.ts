import { Router } from "express";

import main from "./root";
import member from "./member";

const router = Router();

router.get("/", main);
router.use("/member", member);
export default router;
