import { db, buildUpdate } from "../connection";

export class CidadeQueries {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM Cidade");
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.query("SELECT * FROM Cidade WHERE id_cidade = ?", [id]);
    return rows;
  }

  static async create(data: { nome: string; estado: string }) {
    const [result] = await db.query(
      "INSERT INTO Cidade (nome, estado) VALUES (?, ?)",
      [data.nome, data.estado],
    );
    return result;
  }

  static async update(id: number, data: { nome?: string; estado?: string }) {
    const { sql, values } = buildUpdate("Cidade", data, "id_cidade", id);
    if (values.length === 1) return;
    const [result] = await db.query(sql, values);
    return result;
  }

  static async delete(id: number) {
    const [result] = await db.query("DELETE FROM Cidade WHERE id_cidade = ?", [id]);
    return result;
  }
}
