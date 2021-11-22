import { query, RequestHandler } from "express";
import db from "../../lib/db";

const getMembershipList: RequestHandler = async (req, res, next) => {
    try {
        const selectStr = "me_id, me_name, point";
        const queryStr = `select ${selectStr} from membership natural join member`;
        const userList = await db(queryStr);
        res.status(200).json(userList[0]);
    } catch (err) {
        next(err);
    }

    return next();
};

export { getMembershipList };
