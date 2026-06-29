import { db } from "../connection";

export class PagamentoQueries {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM Pagamento");
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.query("SELECT * FROM Pagamento WHERE id_pagamento = ?", [id]);
    return rows;
  }

  static async findByReserva(idReserva: number) {
    const [rows] = await db.query("SELECT * FROM Pagamento WHERE id_reserva = ?", [idReserva]);
    return rows;
  }

  static async create(data: { data_pagamento: string; valor: number; metodo_pagamento?: string; status?: string; id_reserva: number }) {
    const [result] = await db.query(
      "INSERT INTO Pagamento (data_pagamento, valor, metodo_pagamento, status, id_reserva) VALUES (?, ?, ?, ?, ?)",
      [data.data_pagamento, data.valor, data.metodo_pagamento ?? null, data.status ?? "pendente", data.id_reserva],
    );
    return result;
  }
}
