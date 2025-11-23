import { sql } from "../config/db.js";

export class QueryAdmin{
    async list(){
        return await sql`SELECT * FROM admin_users`
    }
}