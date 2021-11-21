import { RequestHandler } from "express";
import db from "../lib/db";

const msg = "Hello KuStore.<br>By Pandracoon. @ 2021";

const main: RequestHandler = async (req, res, next) => {
    res.status(200).json(msg);
    return next();
};

export default main;
