import { PassageiroQueries } from "../../db/queries/passageiro.queries";
import { ViagemQueries } from "../../db/queries/viagem.queries";
import { ReservaQueries } from "../../db/queries/reserva.queries";
import { db } from "../../db/connection";
import { NotFoundError, ConflictError, AppError } from "../../shared/errors";
import { toMySQLDateTime } from "../../shared/utils/date";

export class ReservaService {
  static async findAll() {
    return await ReservaQueries.findAll();
  }

  static async findById(id: number) {
    const rows = await ReservaQueries.findById(id);
    if (!rows[0]) throw new NotFoundError("Reserva não encontrada");
    return rows[0];
  }

  static async findByPassageiro(idPassageiro: number) {
    const passageiro = await PassageiroQueries.findById(idPassageiro);
    if (!passageiro[0]) throw new NotFoundError("Passageiro não encontrado");
    return await ReservaQueries.findByPassageiro(idPassageiro);
  }

  static async findByViagem(idViagem: number) {
    const viagem = await ViagemQueries.findById(idViagem);
    if (!viagem[0]) throw new NotFoundError("Viagem não encontrada");
    return await ReservaQueries.findByViagem(idViagem);
  }

  static async create(data: {
    data_reserva: string;
    numero_assento: number;
    id_passageiro: number;
    id_viagem: number;
  }) {
    const data_reserva = toMySQLDateTime(data.data_reserva);
    const dataReserva = new Date(data_reserva);
    const agora = new Date();
    if (dataReserva < agora) {
      throw new AppError("Data da reserva não pode ser anterior à data atual", 422);
    }

    const payload = { ...data, data_reserva, status: "Confirmada" as const };

    const passageiro = await PassageiroQueries.findById(payload.id_passageiro);
    if (!passageiro[0]) throw new NotFoundError("Passageiro não encontrado");

    const viagem = await ViagemQueries.findById(payload.id_viagem);
    if (!viagem[0]) throw new NotFoundError("Viagem não encontrada");

    const [reservasPassageiro] = await db.query(
      `SELECT v.id_onibus, v.data_partida, v.data_chegada
       FROM Reserva r
       JOIN Viagem v ON r.id_viagem = v.id_viagem
       WHERE r.id_passageiro = ? AND r.status != 'cancelada'`,
      [payload.id_passageiro],
    );

    if (reservasPassageiro.some((r: any) => r.id_onibus === viagem[0].id_onibus)) {
      throw new ConflictError("Passageiro já possui reserva neste ônibus");
    }

    const toDate = (s: string) => new Date(s.replace(" ", "T"));

    const novaPartida = toDate(viagem[0].data_partida);
    const novaChegada = toDate(viagem[0].data_chegada);
    const conflito = reservasPassageiro.some((r: any) => {
      const inicio = toDate(r.data_partida);
      const fim = toDate(r.data_chegada);
      return novaPartida < fim && novaChegada > inicio;
    });
    if (conflito) {
      throw new ConflictError("Passageiro já possui reserva em um horário que conflita com esta viagem");
    }

    const reservasViagem = await ReservaQueries.findByViagem(payload.id_viagem);
    const assentoOcupado = reservasViagem.some(
      (r: any) =>
        r.numero_assento === payload.numero_assento && r.status !== "cancelada",
    );
    if (assentoOcupado) throw new ConflictError("Assento já reservado nesta viagem");

    const [onibusRows] = await db.query(
      "SELECT capacidade FROM Onibus WHERE id_onibus = (SELECT id_onibus FROM Viagem WHERE id_viagem = ?)",
      [payload.id_viagem],
    );
    const capacidade = onibusRows[0]?.capacidade;
    if (payload.numero_assento > capacidade) {
      throw new ConflictError(
        `Assento inválido. O ônibus tem apenas ${capacidade} lugares`,
      );
    }

    const reservasAtivas = reservasViagem.filter(
      (r: any) => r.status !== "cancelada",
    );
    if (reservasAtivas.length >= capacidade) {
      throw new ConflictError("Ônibus lotado. Não há mais assentos disponíveis nesta viagem");
    }

    const result = await ReservaQueries.create(payload);
    return await this.findById(result.insertId);
  }

  static async update(
    id: number,
    data: { numero_assento?: number; status?: string },
  ) {
    const reserva = await ReservaQueries.findById(id);
    if (!reserva[0]) throw new NotFoundError("Reserva não encontrada");

    if (data.numero_assento !== undefined) {
      const reservasViagem = await ReservaQueries.findByViagem(reserva[0].id_viagem);
      const assentoOcupado = reservasViagem.some(
        (r: any) =>
          r.numero_assento === data.numero_assento &&
          r.id_reserva !== id &&
          r.status !== "cancelada",
      );
      if (assentoOcupado) throw new ConflictError("Assento já reservado nesta viagem");
    }

    await ReservaQueries.update(id, data);
    return await this.findById(id);
  }

  static async delete(id: number) {
    const reserva = await ReservaQueries.findById(id);
    if (!reserva[0]) throw new NotFoundError("Reserva não encontrada");

    const [pagamento] = await db.query(
      "SELECT id_pagamento FROM Pagamento WHERE id_reserva = ?",
      [id],
    );
    if (pagamento[0]) throw new ConflictError("Não é possível excluir: reserva possui pagamento vinculado");

    const [passagem] = await db.query(
      "SELECT id_passagem FROM Passagem WHERE id_reserva = ?",
      [id],
    );
    if (passagem[0]) throw new ConflictError("Não é possível excluir: reserva possui passagem vinculada");

    await ReservaQueries.delete(id);
    return { message: "Reserva removida com sucesso" };
  }
}
