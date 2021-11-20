// Attaching plugins to express app.
import Express from "express";

//import initConnection from "./lib/db";
import router from "./router";

//import { CustomError } from "./lib/error";

// DB
//initConnection();

// Routing
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use("/", router);
/*

app.use((err, req, res, next) => {
    console.error(err);

    if (err instanceof CustomError)
        return res.status(err.status).json({
            error: err.code,
            msg: err.message,
        });
    else res.status(500).send({ msg: "Something went wrong..." });
});
*/

export default app;
