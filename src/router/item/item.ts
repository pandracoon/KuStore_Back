import { query, RequestHandler } from "express";
import db from "../../lib/db";

const getItemList: RequestHandler = async (req, res, next) => {
    try {
        const params = req.query.name;
        console.log(params);
        const queryStr = params
            ? `select * from item where it_name = "${params}"`
            : `select * from item`;
        console.log(queryStr);
        const itemList = await db(queryStr);
        res.status(200).json(itemList[0]);
    } catch (err) {
        next(err);
    }

    return next();
};

const getItem: RequestHandler = async (req, res, next) => {
    try {
        const params = req.query.id;
        console.log(params);
        const queryStr = `select * from item where it_id = ${params}`;
        console.log(queryStr);
        const itemList = await db(queryStr);
        console.log(itemList[0]);
        res.status(200).json(itemList[0]);
    } catch (err) {
        next(err);
    }

    return next();
};

const addItem: RequestHandler = async (req, res, next) => {
    try {
        const name = req.body.it_name;
        const price = req.body.price;
        const queryStr = `insert into item (it_name, price) values("${name}", ${price})`;
        const result = await db(queryStr);
        const insertId = result[0].insertId;
        await db(`insert into inventory (it_id) values(${insertId})`);
        res.status(200).json(`Successfully inserted as ID: ${insertId}`);
    } catch (err) {
        next(err);
    }

    return next();
};

const updateItem: RequestHandler = async (req, res, next) => {
    try {
        const id = req.body.id;
        const name = req.body.it_name;
        const price = req.body.price;
        const queryStr = `update item set it_name = "${name}", price = ${price} where it_id = ${id}`;
        await db(queryStr);

        res.status(200).json(`Successfully updated ID: ${id}`);
    } catch (err) {
        next(err);
    }

    return next();
};

const deleteItem: RequestHandler = async (req, res, next) => {
    try {
        const id = req.body.id;
        const queryStr = `delete from item where it_id = "${id}"`;
        await db(queryStr);
        res.status(200).json(`Successfully deleted ID: ${id}`);
    } catch (err) {
        next(err);
    }

    return next();
};

export { getItemList, addItem, updateItem, deleteItem, getItem };
