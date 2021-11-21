import { Router } from "express";
import {
    getOrderList,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrder,
} from "./order";

const router = Router();

router.get("/", getOrderList);
router.get("/search", getOrderList);
router.get("/detail", getOrder);
router.post("/add", addOrder);
router.post("/update", updateOrder);
router.post("/delete", deleteOrder);

export default router;
