import { db, buildUpdate } from "../connection";

export class OnibusQueries {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM Onibus");
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.query("SELECT * FROM Onibus WHERE id_onibus = ?", [id]);
    return rows;
  }

  static async findByPlaca(placa: string) {
    const [rows] = await db.query("SELECT * FROM Onibus WHERE placa = ?", [placa]);
    return rows;
  }

  static async findByEmpresa(idEmpresa: number) {
    const [rows] = await db.query("SELECT * FROM Onibus WHERE id_empresa = ?", [idEmpresa]);
    return rows;
  }

  static async create(data: { placa: string; modelo?: string; capacidade: number; id_empresa: number }) {
    const [result] = await db.query(
      "INSERT INTO Onibus (placa, modelo, capacidade, id_empresa) VALUES (?, ?, ?, ?)",
      [data.placa, data.modelo ?? null, data.capacidade, data.id_empresa],
    );
    return result;
  }

  static async update(id: number, data: { placa?: string; modelo?: string; capacidade?: number }) {
    const { sql, values } = buildUpdate("Onibus", data, "id_onibus", id);
    if (values.length === 1) return;
    const [result] = await db.query(sql, values);
    return result;
  }

  static async delete(id: number) {
    const [result] = await db.query("DELETE FROM Onibus WHERE id_onibus = ?", [id]);
    return result;
  }
}
