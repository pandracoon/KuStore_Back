import { Router } from "express";
import { getItemList, addItem, updateItem, deleteItem, getItem } from "./item";

const router = Router();

router.get("/", getItemList);
router.get("/search", getItemList);
router.get("/detail", getItem);
router.post("/add", addItem);
router.post("/update", updateItem);
router.post("/delete", deleteItem);

export default router;
