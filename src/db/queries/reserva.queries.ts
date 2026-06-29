import { db, buildUpdate } from "../connection";

export class ReservaQueries {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM Reserva");
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.query(
      "SELECT * FROM Reserva WHERE id_reserva = ?",
      [id],
    );
    return rows;
  }

  static async findByPassageiro(idPassageiro: number) {
    const [rows] = await db.query(
      "SELECT * FROM Reserva WHERE id_passageiro = ?",
      [idPassageiro],
    );
    return rows;
  }

  static async findByViagem(idViagem: number) {
    const [rows] = await db.query(
      "SELECT * FROM Reserva WHERE id_viagem = ?",
      [idViagem],
    );
    return rows;
  }

  static async create(data: {
    data_reserva: string;
    numero_assento: number;
    status: string;
    id_passageiro: number;
    id_viagem: number;
  }) {
    const [result] = await db.query(
      `INSERT INTO Reserva (data_reserva, numero_assento, status, id_passageiro, id_viagem)
       VALUES (?, ?, ?, ?, ?)`,
      [data.data_reserva, data.numero_assento, data.status, data.id_passageiro, data.id_viagem],
    );
    return result;
  }

  static async update(
    id: number,
    data: { numero_assento?: number; status?: string },
  ) {
    const { sql, values } = buildUpdate("Reserva", data, "id_reserva", id);
    if (values.length === 1) return;
    const [result] = await db.query(sql, values);
    return result;
  }

  static async delete(id: number) {
    const [result] = await db.query(
      "DELETE FROM Reserva WHERE id_reserva = ?",
      [id],
    );
    return result;
  }
}
