import { ViagemQueries } from "../../db/queries/viagem.queries";
import { RotaQueries } from "../../db/queries/rota.queries";
import { OnibusQueries } from "../../db/queries/onibus.queries";
import { db } from "../../db/connection";
import { NotFoundError, ConflictError, BadRequestError } from "../../shared/errors";
import { toMySQLDateTime } from "../../shared/utils/date";

export class ViagemService {
  static async findAll() {
    return await ViagemQueries.findAll();
  }

  static async findById(id: number) {
    const rows = await ViagemQueries.findById(id);
    if (!rows[0]) throw new NotFoundError("Viagem não encontrada");
    return rows[0];
  }

  static async findByRota(idRota: number) {
    const rota = await RotaQueries.findById(idRota);
    if (!rota[0]) throw new NotFoundError("Rota não encontrada");
    return await ViagemQueries.findByRota(idRota);
  }

  static async findByOnibus(idOnibus: number) {
    const onibus = await OnibusQueries.findById(idOnibus);
    if (!onibus[0]) throw new NotFoundError("Ônibus não encontrado");
    return await ViagemQueries.findByOnibus(idOnibus);
  }

  static async create(data: { data_partida: string; data_chegada: string; valor_passagem: number; id_rota: number; id_onibus: number }) {
    const rota = await RotaQueries.findById(data.id_rota);
    if (!rota[0]) throw new NotFoundError("Rota não encontrada");

    const onibus = await OnibusQueries.findById(data.id_onibus);
    if (!onibus[0]) throw new NotFoundError("Ônibus não encontrado");

    const data_partida = toMySQLDateTime(data.data_partida);
    const data_chegada = toMySQLDateTime(data.data_chegada);

    if (new Date(data_chegada) <= new Date(data_partida)) {
      throw new BadRequestError("Data de chegada deve ser posterior à data de partida");
    }

    const result = await ViagemQueries.create({ ...data, data_partida, data_chegada });
    return await this.findById(result.insertId);
  }

  static async update(id: number, data: { data_partida?: string; data_chegada?: string; valor_passagem?: number }) {
    const viagem = await ViagemQueries.findById(id);
    if (!viagem[0]) throw new NotFoundError("Viagem não encontrada");

    const normalized = {
      ...data,
      ...(data.data_partida !== undefined && { data_partida: toMySQLDateTime(data.data_partida) }),
      ...(data.data_chegada !== undefined && { data_chegada: toMySQLDateTime(data.data_chegada) }),
    };

    await ViagemQueries.update(id, normalized);
    return await this.findById(id);
  }

  static async delete(id: number) {
    const viagem = await ViagemQueries.findById(id);
    if (!viagem[0]) throw new NotFoundError("Viagem não encontrada");

    const [reservas] = await db.query(
      "SELECT id_reserva FROM Reserva WHERE id_viagem = ? LIMIT 1",
      [id],
    );
    if (reservas[0]) throw new ConflictError("Não é possível excluir: viagem possui reservas vinculadas");

    await ViagemQueries.delete(id);
    return { message: "Viagem removida com sucesso" };
  }
}
