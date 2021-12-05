import { createPool } from "mysql2/promise";
import password from "./secret";

const pool = createPool({
    host: "localhost",
    user: "root",
    database: "KuStore",
    password: password,
});

const db = async (queryStr: string) => {
    let conn, rows;
    try {
        conn = await pool.getConnection();
        rows = await conn.query(queryStr); // 쿼리 실행
        conn.release();
        return rows;
    } catch (err) {
        conn.release();
        throw new Error("Query ERR");
    }
};

export { db, pool };
