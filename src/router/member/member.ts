import { query, RequestHandler } from "express";
import db from "../../lib/db";

const getMemberList: RequestHandler = async (req, res, next) => {
    try {
        const params = req.query.name;
        const queryStr = params
            ? `select * from member where name = "${params}"`
            : `select * from member`;
        console.log(queryStr);
        const userList = await db(queryStr);
        console.log(userList[0]);
        res.status(200).json(userList[0]);
    } catch (err) {
        next(err);
    }

    return next();
};

const addMember: RequestHandler = async (req, res, next) => {
    try {
        const name = req.body.name;
        const phone = req.body.phone;
        const queryStr = `insert into member (name, phone) values("${name}", "${phone}")`;
        const result = await db(queryStr);
        const insertId = result[0].insertId;
        res.status(200).json(`Successfully inserted as ID: ${insertId}`);
    } catch (err) {
        next(err);
    }

    return next();
};

const updateMember: RequestHandler = async (req, res, next) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const phone = req.body.phone;
        const queryStr = `update member set name = "${name}", phone = "${phone}" where me_id = "${id}"`;
        await db(queryStr);

        res.status(200).json(`Successfully updated ID: ${id}`);
    } catch (err) {
        next(err);
    }

    return next();
};

const deleteMember: RequestHandler = async (req, res, next) => {
    try {
        const id = req.body.id;
        const queryStr = `delete from member where me_id = "${id}"`;
        await db(queryStr);
        res.status(200).json(`Successfully deleted ID: ${id}`);
    } catch (err) {
        next(err);
    }

    return next();
};

export { getMemberList, addMember, updateMember, deleteMember };
