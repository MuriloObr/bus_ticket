import { PassagemQueries } from "../../db/queries/passagem.queries";
import { ReservaQueries } from "../../db/queries/reserva.queries";
import { NotFoundError, ConflictError } from "../../shared/errors";
import { toMySQLDateTime } from "../../shared/utils/date";
import crypto from "crypto";

export class PassagemService {
  static async findAll() {
    return await PassagemQueries.findAll();
  }

  static async findById(id: number) {
    const rows = await PassagemQueries.findById(id);
    if (!rows[0]) throw new NotFoundError("Passagem não encontrada");
    return rows[0];
  }

  static async findByReserva(idReserva: number) {
    const reserva = await ReservaQueries.findById(idReserva);
    if (!reserva[0]) throw new NotFoundError("Reserva não encontrada");
    return await PassagemQueries.findByReserva(idReserva);
  }

  static async create(data: { data_emissao: string; id_reserva: number }) {
    const reserva = await ReservaQueries.findById(data.id_reserva);
    if (!reserva[0]) throw new NotFoundError("Reserva não encontrada");

    const passagemExiste = await PassagemQueries.findByReserva(data.id_reserva);
    if (passagemExiste[0]) throw new ConflictError("Reserva já possui passagem vinculada");

    const codigoEmbarque = crypto.randomUUID().slice(0, 8).toUpperCase();

    const result = await PassagemQueries.create({
      codigo_embarque: codigoEmbarque,
      data_emissao: toMySQLDateTime(data.data_emissao),
      id_reserva: data.id_reserva,
    });
    return await this.findById(result.insertId);
  }
}
