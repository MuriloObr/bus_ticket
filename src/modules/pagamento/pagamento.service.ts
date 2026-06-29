import { PagamentoQueries } from "../../db/queries/pagamento.queries";
import { ReservaQueries } from "../../db/queries/reserva.queries";
import { NotFoundError, ConflictError } from "../../shared/errors";
import { toMySQLDateTime } from "../../shared/utils/date";

export class PagamentoService {
  static async findAll() {
    return await PagamentoQueries.findAll();
  }

  static async findById(id: number) {
    const rows = await PagamentoQueries.findById(id);
    if (!rows[0]) throw new NotFoundError("Pagamento não encontrado");
    return rows[0];
  }

  static async findByReserva(idReserva: number) {
    const reserva = await ReservaQueries.findById(idReserva);
    if (!reserva[0]) throw new NotFoundError("Reserva não encontrada");
    return await PagamentoQueries.findByReserva(idReserva);
  }

  static async create(data: { data_pagamento: string; valor: number; metodo_pagamento?: string; id_reserva: number }) {
    const reserva = await ReservaQueries.findById(data.id_reserva);
    if (!reserva[0]) throw new NotFoundError("Reserva não encontrada");

    const pagamentoExiste = await PagamentoQueries.findByReserva(data.id_reserva);
    if (pagamentoExiste[0]) throw new ConflictError("Reserva já possui pagamento vinculado");

    const result = await PagamentoQueries.create({
      ...data,
      data_pagamento: toMySQLDateTime(data.data_pagamento),
      status: "pendente",
    });
    return await this.findById(result.insertId);
  }
}
