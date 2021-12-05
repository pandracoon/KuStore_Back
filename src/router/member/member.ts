import { query, RequestHandler } from "express";
import { CustomError } from "../../lib/CustomError";
import { pool } from "../../lib/db";

const getMemberList: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const params = req.query.name;
        const queryStr = params
            ? `select * from member where me_name = "${params}"`
            : `select * from member`;
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

const getMember: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const params = req.query.id;
        const queryStr = `select * from member where me_id = ${params}`;
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

const addMember: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const name = req.body.me_name;
        const phone = req.body.phone;
        const queryStr = `insert into member (me_name, phone) values("${name}", "${phone}")`;
        const result: any = await conn.query(queryStr);
        const insertId = result[0].insertId;
        await conn.query(`insert into membership (me_id) values(${insertId})`);
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

const updateMember: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const id = req.body.id;
        const name = req.body.me_name;
        const phone = req.body.phone;
        const queryStr = `update member set me_name = "${name}", phone = "${phone}" where me_id = "${id}"`;
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

const deleteMember: RequestHandler = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const id = req.body.id;
        const queryStr = `delete from member where me_id = "${id}"`;
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

export { getMemberList, addMember, updateMember, deleteMember, getMember };
