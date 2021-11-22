import { query, RequestHandler } from "express";
import db from "../../lib/db";

const getOrderList: RequestHandler = async (req, res, next) => {
    try {
        const params = req.query.name;
        console.log(params);
        const selectStr =
            "or_id, me_id, it_id, me_name, it_name, amount, total_price, time";
        const joinStr = "orders natural join member natural join item";
        const queryStr = params
            ? `select ${selectStr} from ${joinStr} where me_name = "${params}"`
            : `select ${selectStr} from ${joinStr}`;
        console.log(queryStr);
        const orderList = await db(queryStr);
        res.status(200).json(orderList[0]);
    } catch (err) {
        next(err);
    }

    return next();
};

const getOrder: RequestHandler = async (req, res, next) => {
    try {
        const params = req.query.id;
        console.log(params);
        const selectStr =
            "or_id, me_id, it_id, me_name, it_name, amount, total_price, time";
        const joinStr = "orders natural join member natural join item";
        const queryStr = `select ${selectStr} from ${joinStr} where or_id = ${params}`;
        console.log(queryStr);
        const orderList = await db(queryStr);
        console.log(orderList[0]);
        res.status(200).json(orderList[0]);
    } catch (err) {
        next(err);
    }

    return next();
};

const addOrder: RequestHandler = async (req, res, next) => {
    try {
        const me_id = req.body.me_id;
        const it_id = req.body.it_id;
        const amount = req.body.amount;
        const itemRes = await db(`select * from item where it_id = ${it_id}`);
        const total_price = amount * itemRes[0][0].price;
        const queryStr = `insert into orders (me_id, it_id, amount, total_price) values(${me_id}, ${it_id}, ${amount}, ${total_price})`;
        const result = await db(queryStr);
        await addPoint(me_id, total_price);
        await sellItem(it_id, amount);
        const insertId = result[0].insertId;
        res.status(200).json(`Successfully inserted as ID: ${insertId}`);
    } catch (err) {
        next(err);
    }

    return next();
};

const updateOrder: RequestHandler = async (req, res, next) => {
    try {
        const or_id = req.body.or_id;
        const me_id = req.body.me_id;
        const it_id = req.body.it_id;
        const amount = req.body.amount;
        const itemRes = await db(`select * from item where it_id = ${it_id}`);
        const total_price = amount * itemRes[0][0].price;
        await rollBackPoint(or_id);
        await rollBackItem(or_id);
        const queryStr = `update orders set me_id = ${me_id}, it_id = ${it_id}, amount = ${amount}, total_price = ${total_price} where or_id = "${or_id}"`;
        await db(queryStr);
        await addPoint(me_id, total_price);
        await sellItem(it_id, amount);

        res.status(200).json(`Successfully updated ID: ${or_id}`);
    } catch (err) {
        next(err);
    }

    return next();
};

const deleteOrder: RequestHandler = async (req, res, next) => {
    try {
        const id = req.body.id;
        const queryStr = `delete from orders where or_id = "${id}"`;
        await rollBackPoint(id);
        await rollBackItem(id);
        await db(queryStr);
        res.status(200).json(`Successfully deleted ID: ${id}`);
    } catch (err) {
        next(err);
    }

    return next();
};

const addPoint = async (me_id, price) => {
    try {
        const membershipInfo = await db(
            `select * from membership where me_id = ${me_id}`
        );
        const prevPoint = membershipInfo[0][0].point;
        const curPoint = prevPoint + price * 0.01;
        await db(
            `update membership set point = ${curPoint} where me_id = ${me_id}`
        );
    } catch (err) {
        throw err;
    }
};

const rollBackPoint = async (or_id) => {
    try {
        const orderInfo = await db(
            `select * from orders where or_id = ${or_id}`
        );
        const price = orderInfo[0][0].total_price;
        const me_id = orderInfo[0][0].me_id;
        const membershipInfo = await db(
            `select * from membership where me_id = ${me_id}`
        );
        const prevPoint = membershipInfo[0][0].point;
        const curPoint = prevPoint - price * 0.01;
        await db(
            `update membership set point = ${curPoint} where me_id = ${me_id}`
        );
    } catch (err) {
        throw err;
    }
};

const sellItem = async (it_id, amount) => {
    try {
        const inventoryInfo = await db(
            `select * from inventory where it_id = ${it_id}`
        );
        console.log("here");
        console.log(it_id);
        console.log(inventoryInfo);
        const prevStorage = inventoryInfo[0][0].storage;
        const curStorage = prevStorage - amount > 0 ? prevStorage - amount : 10;
        await db(
            `update inventory set storage = ${curStorage} where it_id = ${it_id}`
        );
    } catch (err) {
        throw err;
    }
};

const rollBackItem = async (or_id) => {
    try {
        const orderInfo = await db(
            `select * from orders where or_id = ${or_id}`
        );
        const amount = orderInfo[0][0].amount;
        const it_id = orderInfo[0][0].it_id;
        const inventoryInfo = await db(
            `select * from inventory where it_id = ${it_id}`
        );
        const prevStorage = inventoryInfo[0][0].storage;
        const curStorage = prevStorage + amount;
        await db(
            `update inventory set storage = ${curStorage} where it_id = ${it_id}`
        );
    } catch (err) {
        throw err;
    }
};

export { getOrderList, addOrder, updateOrder, deleteOrder, getOrder };
