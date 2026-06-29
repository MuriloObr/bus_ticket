import { db, buildUpdate } from "../connection";

export class ViagemQueries {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM Viagem");
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.query(
      "SELECT * FROM Viagem WHERE id_viagem = ?",
      [id],
    );
    return rows;
  }

  static async findByRota(idRota: number) {
    const [rows] = await db.query(
      "SELECT * FROM Viagem WHERE id_rota = ?",
      [idRota],
    );
    return rows;
  }

  static async findByOnibus(idOnibus: number) {
    const [rows] = await db.query(
      "SELECT * FROM Viagem WHERE id_onibus = ?",
      [idOnibus],
    );
    return rows;
  }

  static async create(data: {
    data_partida: string;
    data_chegada: string;
    valor_passagem: number;
    id_rota: number;
    id_onibus: number;
  }) {
    const [result] = await db.query(
      `INSERT INTO Viagem (data_partida, data_chegada, valor_passagem, id_rota, id_onibus)
       VALUES (?, ?, ?, ?, ?)`,
      [data.data_partida, data.data_chegada, data.valor_passagem, data.id_rota, data.id_onibus],
    );
    return result;
  }

  static async update(
    id: number,
    data: {
      data_partida?: string;
      data_chegada?: string;
      valor_passagem?: number;
    },
  ) {
    const { sql, values } = buildUpdate("Viagem", data, "id_viagem", id);
    if (values.length === 1) return;
    const [result] = await db.query(sql, values);
    return result;
  }

  static async delete(id: number) {
    const [result] = await db.query(
      "DELETE FROM Viagem WHERE id_viagem = ?",
      [id],
    );
    return result;
  }
}
