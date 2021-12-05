import { query, RequestHandler } from "express";
import { CustomError } from "../../lib/CustomError";
import { pool, db } from "../../lib/db";

const getItemList: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const params = req.query.name;
        console.log(params);
        const queryStr = params
            ? `select * from item where it_name = "${params}"`
            : `select * from item`;
        console.log(queryStr);
        const itemList = await conn.query(queryStr);
        await conn.commit();
        res.status(200).json(itemList[0]);
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

const getItem: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const params = req.query.id;
        const queryStr = `select * from item where it_id = ${params}`;
        const itemList = await conn.query(queryStr);
        await conn.commit();
        res.status(200).json(itemList[0]);
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

const addItem: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const name = req.body.it_name;
        const price = req.body.price;
        const queryStr = `insert into item (it_name, price) values("${name}", ${price})`;
        const result: any = await conn.query(queryStr);
        const insertId = result[0].insertId;
        await conn.query(`insert into inventory (it_id) values(${insertId})`);
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

const updateItem: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const id = req.body.id;
        const name = req.body.it_name;
        const price = req.body.price;
        const queryStr = `update item set it_name = "${name}", price = ${price} where it_id = ${id}`;
        await conn.query(queryStr);
        await conn.commit();
        res.status(200).json(`Successfully updated ID: ${id}`);
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

const deleteItem: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const id = req.body.id;
        const queryStr = `delete from item where it_id = "${id}"`;
        await conn.query(queryStr);
        await conn.commit();
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

export { getItemList, addItem, updateItem, deleteItem, getItem };
