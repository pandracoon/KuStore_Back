import { query, RequestHandler } from "express";
import { CustomError } from "../../lib/CustomError";
import { pool } from "../../lib/db";

const getMembershipList: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const selectStr = "me_id, me_name, point";
        const queryStr = `select ${selectStr} from membership natural join member`;
        const userList = await conn.query(queryStr);
        await conn.commit();
        res.status(200).json(userList[0]);
    } catch (err) {
        await conn.rollback();
        next(
            new CustomError(
                "QUERY_FAILED",
                409,
                "Internal SQL Query is failed. Please check your input body."
            )
        );
    } finally {
        conn.release();
    }

    return next();
};

export { getMembershipList };
