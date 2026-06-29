import { CidadeQueries } from "../../db/queries/cidade.queries";
import { db } from "../../db/connection";
import { NotFoundError, ConflictError } from "../../shared/errors";

export class CidadeService {
  static async findAll() {
    return await CidadeQueries.findAll();
  }

  static async findById(id: number) {
    const rows = await CidadeQueries.findById(id);
    if (!rows[0]) throw new NotFoundError("Cidade não encontrada");
    return rows[0];
  }

  static async create(data: { nome: string; estado: string }) {
    const result = await CidadeQueries.create(data);
    return await this.findById(result.insertId);
  }

  static async update(id: number, data: { nome?: string; estado?: string }) {
    const cidade = await CidadeQueries.findById(id);
    if (!cidade[0]) throw new NotFoundError("Cidade não encontrada");
    await CidadeQueries.update(id, data);
    return await this.findById(id);
  }

  static async delete(id: number) {
    const cidade = await CidadeQueries.findById(id);
    if (!cidade[0]) throw new NotFoundError("Cidade não encontrada");

    const [rotas] = await db.query(
      "SELECT id_rota FROM Rota WHERE id_cidade_origem = ? OR id_cidade_destino = ? LIMIT 1",
      [id, id],
    );
    if (rotas[0]) throw new ConflictError("Não é possível excluir: cidade possui rotas vinculadas");

    await CidadeQueries.delete(id);
    return { message: "Cidade removida com sucesso" };
  }
}
