import { OnibusQueries } from "../../db/queries/onibus.queries";
import { EmpresaQueries } from "../../db/queries/empresa.queries";
import { db } from "../../db/connection";
import { NotFoundError, ConflictError } from "../../shared/errors";

export class OnibusService {
  static async findAll() {
    return await OnibusQueries.findAll();
  }

  static async findById(id: number) {
    const rows = await OnibusQueries.findById(id);
    if (!rows[0]) throw new NotFoundError("Ônibus não encontrado");
    return rows[0];
  }

  static async findByEmpresa(idEmpresa: number) {
    const empresa = await EmpresaQueries.findById(idEmpresa);
    if (!empresa[0]) throw new NotFoundError("Empresa não encontrada");
    return await OnibusQueries.findByEmpresa(idEmpresa);
  }

  static async create(data: { placa: string; modelo?: string; capacidade: number; id_empresa: number }) {
    const empresa = await EmpresaQueries.findById(data.id_empresa);
    if (!empresa[0]) throw new NotFoundError("Empresa não encontrada");

    const placaExists = await OnibusQueries.findByPlaca(data.placa);
    if (placaExists[0]) throw new ConflictError("Placa já cadastrada");

    const result = await OnibusQueries.create(data);
    return await this.findById(result.insertId);
  }

  static async update(id: number, data: { placa?: string; modelo?: string; capacidade?: number }) {
    const onibus = await OnibusQueries.findById(id);
    if (!onibus[0]) throw new NotFoundError("Ônibus não encontrado");

    if (data.placa && data.placa !== onibus[0].placa) {
      const placaExists = await OnibusQueries.findByPlaca(data.placa);
      if (placaExists[0]) throw new ConflictError("Placa já cadastrada");
    }

    await OnibusQueries.update(id, data);
    return await this.findById(id);
  }

  static async delete(id: number) {
    const onibus = await OnibusQueries.findById(id);
    if (!onibus[0]) throw new NotFoundError("Ônibus não encontrado");

    const [viagens] = await db.query(
      "SELECT id_viagem FROM Viagem WHERE id_onibus = ? LIMIT 1",
      [id],
    );
    if (viagens[0]) throw new ConflictError("Não é possível excluir: ônibus possui viagens vinculadas");

    await OnibusQueries.delete(id);
    return { message: "Ônibus removido com sucesso" };
  }
}
