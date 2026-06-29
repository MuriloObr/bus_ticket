import { db, buildUpdate } from "../connection";

export class RotaQueries {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM Rota");
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.query("SELECT * FROM Rota WHERE id_rota = ?", [id]);
    return rows;
  }

  static async create(data: { distancia_km?: number; tempo_estimado?: string; id_cidade_origem: number; id_cidade_destino: number }) {
    const [result] = await db.query(
      "INSERT INTO Rota (distancia_km, tempo_estimado, id_cidade_origem, id_cidade_destino) VALUES (?, ?, ?, ?)",
      [data.distancia_km ?? null, data.tempo_estimado ?? null, data.id_cidade_origem, data.id_cidade_destino],
    );
    return result;
  }

  static async update(id: number, data: { distancia_km?: number; tempo_estimado?: string }) {
    const { sql, values } = buildUpdate("Rota", data, "id_rota", id);
    if (values.length === 1) return;
    const [result] = await db.query(sql, values);
    return result;
  }

  static async delete(id: number) {
    const [result] = await db.query("DELETE FROM Rota WHERE id_rota = ?", [id]);
    return result;
  }
}
