// Entry point of KUAAA Server.
import server from "./server";

const host = process.env.BACKEND_HOST || "127.0.0.1";
const port = Number(process.env.BACKEND_PORT) || 31413;

const init = `
Hello KUStore. \n
Server is listening on ${host}::${port}.
`;

server.listen(port, host, () => console.log(init));
