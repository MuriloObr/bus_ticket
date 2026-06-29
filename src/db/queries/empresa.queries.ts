import { db, buildUpdate } from "../connection";

export class EmpresaQueries {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM Empresa");
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.query("SELECT * FROM Empresa WHERE id_empresa = ?", [id]);
    return rows;
  }

  static async findByCnpj(cnpj: string) {
    const cleaned = cnpj.replace(/\D/g, "");
    const [rows] = await db.query("SELECT * FROM Empresa WHERE REPLACE(REPLACE(REPLACE(cnpj, '.', ''), '-', ''), '/', '') = ?", [cleaned]);
    return rows;
  }

  static async create(data: { nome: string; cnpj: string; telefone?: string; email?: string }) {
    const [result] = await db.query(
      "INSERT INTO Empresa (nome, cnpj, telefone, email) VALUES (?, ?, ?, ?)",
      [data.nome, data.cnpj, data.telefone ?? null, data.email ?? null],
    );
    return result;
  }

  static async update(id: number, data: { nome?: string; cnpj?: string; telefone?: string; email?: string }) {
    const { sql, values } = buildUpdate("Empresa", data, "id_empresa", id);
    if (values.length === 1) return;
    const [result] = await db.query(sql, values);
    return result;
  }

  static async delete(id: number) {
    const [result] = await db.query("DELETE FROM Empresa WHERE id_empresa = ?", [id]);
    return result;
  }
}
