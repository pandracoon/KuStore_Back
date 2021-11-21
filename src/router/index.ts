import { Router } from "express";

import main from "./root";
import member from "./member";
import item from "./item";
import order from "./order";

const router = Router();

router.get("/", main);
router.use("/member", member);
router.use("/item", item);
router.use("/order", order);
export default router;
