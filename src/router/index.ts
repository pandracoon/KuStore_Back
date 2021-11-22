import { Router } from "express";

import main from "./root";
import member from "./member";
import item from "./item";
import order from "./order";
import membership from "./membership";
import inventory from "./inventory";

const router = Router();

router.get("/", main);
router.use("/member", member);
router.use("/item", item);
router.use("/order", order);
router.use("/membership", membership);
router.use("/inventory", inventory);
export default router;
