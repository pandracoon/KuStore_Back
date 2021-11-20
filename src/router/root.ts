import { RequestHandler } from "express";

const msg = "Hello KUAAA.<br>By Pngwna. @ 2021";

const main: RequestHandler = (req, res, next) => {
    res.status(200).json({ msg });
    return next();
};

export default main;
