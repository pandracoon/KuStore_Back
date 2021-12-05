import { query, RequestHandler } from "express";
import { CustomError } from "../../lib/CustomError";
import { pool } from "../../lib/db";

const getOrderList: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const params = req.query.name;
        const selectStr =
            "or_id, me_id, it_id, me_name, it_name, amount, total_price, time";
        const joinStr = "orders natural join member natural join item";
        const queryStr = params
            ? `select ${selectStr} from ${joinStr} where me_name = "${params}"`
            : `select ${selectStr} from ${joinStr}`;
        const orderList = await conn.query(queryStr);
        await conn.commit();
        res.status(200).json(orderList[0]);
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

const getOrder: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const params = req.query.id;
        const selectStr =
            "or_id, me_id, it_id, me_name, it_name, amount, total_price, time";
        const joinStr = "orders natural join member natural join item";
        const queryStr = `select ${selectStr} from ${joinStr} where or_id = ${params}`;
        const orderList = await conn.query(queryStr);
        await conn.commit();
        res.status(200).json(orderList[0]);
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

const addOrder: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const me_id = req.body.me_id;
        const it_id = req.body.it_id;
        const amount = req.body.amount;
        const itemRes = await conn.query(
            `select * from item where it_id = ${it_id}`
        );
        const total_price = amount * itemRes[0][0].price;
        const queryStr = `insert into orders (me_id, it_id, amount, total_price) values(${me_id}, ${it_id}, ${amount}, ${total_price})`;
        const result: any = await conn.query(queryStr);
        await addPoint(me_id, total_price, conn);
        await sellItem(it_id, amount, conn);
        const insertId = result[0].insertId;
        await conn.commit();
        res.status(200).json(`Successfully inserted as ID: ${insertId}`);
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

const updateOrder: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const or_id = req.body.or_id;
        const me_id = req.body.me_id;
        const it_id = req.body.it_id;
        const amount = req.body.amount;
        const itemRes = await conn.query(
            `select * from item where it_id = ${it_id}`
        );
        const total_price = amount * itemRes[0][0].price;
        await rollBackPoint(or_id, conn);
        await rollBackItem(or_id, conn);
        const queryStr = `update orders set me_id = ${me_id}, it_id = ${it_id}, amount = ${amount}, total_price = ${total_price} where or_id = "${or_id}"`;
        await conn.query(queryStr);
        await addPoint(me_id, total_price, conn);
        await sellItem(it_id, amount, conn);
        await conn.commit();
        res.status(200).json(`Successfully updated ID: ${or_id}`);
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

const deleteOrder: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const id = req.body.id;
        const queryStr = `delete from orders where or_id = "${id}"`;
        await rollBackPoint(id, conn);
        await rollBackItem(id, conn);
        await conn.query(queryStr);
        res.status(200).json(`Successfully deleted ID: ${id}`);
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

const addPoint = async (me_id, price, conn) => {
    try {
        const membershipInfo = await conn.query(
            `select * from membership where me_id = ${me_id}`
        );
        const prevPoint = membershipInfo[0][0].point;
        const curPoint = prevPoint + price * 0.01;
        await conn.query(
            `update membership set point = ${curPoint} where me_id = ${me_id}`
        );
    } catch (err) {
        throw err;
    }
};

const rollBackPoint = async (or_id, conn) => {
    try {
        const orderInfo = await conn.query(
            `select * from orders where or_id = ${or_id}`
        );
        const price = orderInfo[0][0].total_price;
        const me_id = orderInfo[0][0].me_id;
        const membershipInfo = await conn.query(
            `select * from membership where me_id = ${me_id}`
        );
        const prevPoint = membershipInfo[0][0].point;
        const curPoint = prevPoint - price * 0.01;
        await conn.query(
            `update membership set point = ${curPoint} where me_id = ${me_id}`
        );
    } catch (err) {
        throw err;
    }
};

const sellItem = async (it_id, amount, conn) => {
    try {
        const inventoryInfo = await conn.query(
            `select * from inventory where it_id = ${it_id}`
        );
        console.log("here");
        console.log(it_id);
        console.log(inventoryInfo);
        const prevStorage = inventoryInfo[0][0].storage;
        const curStorage = prevStorage - amount > 0 ? prevStorage - amount : 10;
        await conn.query(
            `update inventory set storage = ${curStorage} where it_id = ${it_id}`
        );
    } catch (err) {
        throw err;
    }
};

const rollBackItem = async (or_id, conn) => {
    try {
        const orderInfo = await conn.query(
            `select * from orders where or_id = ${or_id}`
        );
        const amount = orderInfo[0][0].amount;
        const it_id = orderInfo[0][0].it_id;
        const inventoryInfo = await conn.query(
            `select * from inventory where it_id = ${it_id}`
        );
        const prevStorage = inventoryInfo[0][0].storage;
        const curStorage = prevStorage + amount;
        await conn.query(
            `update inventory set storage = ${curStorage} where it_id = ${it_id}`
        );
    } catch (err) {
        throw err;
    }
};

export { getOrderList, addOrder, updateOrder, deleteOrder, getOrder };
