import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bus_ticket",
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  decimalNumbers: true,
});

export function buildUpdate(table: string, data: Record<string, any>, idField: string, id: number) {
  const keys = Object.keys(data).filter((k) => data[k] !== undefined);
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => data[k]);
  const sql = `UPDATE ${table} SET ${sets} WHERE ${idField} = ?`;
  return { sql, values: [...values, id] };
}

export const db = {
  query: (sql: string, params?: any[]) => pool.query(sql, params) as any,
  end: () => pool.end(),
};
