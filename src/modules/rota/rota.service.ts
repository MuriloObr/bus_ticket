import { RotaQueries } from "../../db/queries/rota.queries";
import { CidadeQueries } from "../../db/queries/cidade.queries";
import { db } from "../../db/connection";
import { NotFoundError, ConflictError, BadRequestError } from "../../shared/errors";

export class RotaService {
  static async findAll() {
    return await RotaQueries.findAll();
  }

  static async findById(id: number) {
    const rows = await RotaQueries.findById(id);
    if (!rows[0]) throw new NotFoundError("Rota não encontrada");
    return rows[0];
  }

  static async create(data: { distancia_km?: number; tempo_estimado?: string; id_cidade_origem: number; id_cidade_destino: number }) {
    if (data.id_cidade_origem === data.id_cidade_destino) {
      throw new BadRequestError("Origem e destino devem ser diferentes");
    }

    const origem = await CidadeQueries.findById(data.id_cidade_origem);
    if (!origem[0]) throw new NotFoundError("Cidade de origem não encontrada");

    const destino = await CidadeQueries.findById(data.id_cidade_destino);
    if (!destino[0]) throw new NotFoundError("Cidade de destino não encontrada");

    const result = await RotaQueries.create(data);
    return await this.findById(result.insertId);
  }

  static async update(id: number, data: { distancia_km?: number; tempo_estimado?: string }) {
    const rota = await RotaQueries.findById(id);
    if (!rota[0]) throw new NotFoundError("Rota não encontrada");

    await RotaQueries.update(id, data);
    return await this.findById(id);
  }

  static async delete(id: number) {
    const rota = await RotaQueries.findById(id);
    if (!rota[0]) throw new NotFoundError("Rota não encontrada");

    const [viagens] = await db.query(
      "SELECT id_viagem FROM Viagem WHERE id_rota = ? LIMIT 1",
      [id],
    );
    if (viagens[0]) throw new ConflictError("Não é possível excluir: rota possui viagens vinculadas");

    await RotaQueries.delete(id);
    return { message: "Rota removida com sucesso" };
  }
}
