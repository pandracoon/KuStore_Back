import { query, RequestHandler } from "express";
import { CustomError } from "../../lib/CustomError";
import { pool } from "../../lib/db";

const getInventoryList: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    await conn.query("set transaction isolation level serializable");
    try {
        await conn.beginTransaction();
        const selectStr = "it_id, it_name, storage";
        const queryStr = `select ${selectStr} from inventory natural join item`;
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

export { getInventoryList };
