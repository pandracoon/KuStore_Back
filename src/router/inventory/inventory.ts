import { query, RequestHandler } from "express";
import db from "../../lib/db";

const getInventoryList: RequestHandler = async (req, res, next) => {
    try {
        const selectStr = "it_id, it_name, storage";
        const queryStr = `select ${selectStr} from inventory natural join item`;
        const userList = await db(queryStr);
        res.status(200).json(userList[0]);
    } catch (err) {
        next(err);
    }

    return next();
};

export { getInventoryList };
