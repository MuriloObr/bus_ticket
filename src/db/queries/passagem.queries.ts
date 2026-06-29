import { db } from "../connection";

export class PassagemQueries {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM Passagem");
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.query("SELECT * FROM Passagem WHERE id_passagem = ?", [id]);
    return rows;
  }

  static async findByReserva(idReserva: number) {
    const [rows] = await db.query("SELECT * FROM Passagem WHERE id_reserva = ?", [idReserva]);
    return rows;
  }

  static async create(data: { codigo_embarque: string; data_emissao: string; id_reserva: number }) {
    const [result] = await db.query(
      "INSERT INTO Passagem (codigo_embarque, data_emissao, id_reserva) VALUES (?, ?, ?)",
      [data.codigo_embarque, data.data_emissao, data.id_reserva],
    );
    return result;
  }
}
