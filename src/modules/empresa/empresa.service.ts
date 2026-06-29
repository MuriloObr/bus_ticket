import { EmpresaQueries } from "../../db/queries/empresa.queries";
import { db } from "../../db/connection";
import { NotFoundError, ConflictError, BadRequestError } from "../../shared/errors";
import { isValidCNPJ, stripCNPJ, formatCNPJ } from "../../shared/utils";

export class EmpresaService {
  static async findAll() {
    return await EmpresaQueries.findAll();
  }

  static async findById(id: number) {
    const rows = await EmpresaQueries.findById(id);
    if (!rows[0]) throw new NotFoundError("Empresa não encontrada");
    return rows[0];
  }

  static async create(data: { nome: string; cnpj: string; telefone?: string; email?: string }) {
    if (!isValidCNPJ(data.cnpj)) throw new BadRequestError("CNPJ inválido");

    const cnpjClean = stripCNPJ(data.cnpj);
    const cnpjExists = await EmpresaQueries.findByCnpj(cnpjClean);
    if (cnpjExists[0]) throw new ConflictError("CNPJ já cadastrado");

    const result = await EmpresaQueries.create({ ...data, cnpj: formatCNPJ(cnpjClean) });
    return await this.findById(result.insertId);
  }

  static async update(id: number, data: { nome?: string; cnpj?: string; telefone?: string; email?: string }) {
    const empresa = await EmpresaQueries.findById(id);
    if (!empresa[0]) throw new NotFoundError("Empresa não encontrada");

    if (data.cnpj !== undefined && stripCNPJ(data.cnpj) !== stripCNPJ(empresa[0].cnpj)) {
      if (!isValidCNPJ(data.cnpj)) throw new BadRequestError("CNPJ inválido");
      const cnpjExists = await EmpresaQueries.findByCnpj(data.cnpj);
      if (cnpjExists[0]) throw new ConflictError("CNPJ já cadastrado");
      data.cnpj = formatCNPJ(stripCNPJ(data.cnpj));
    }

    await EmpresaQueries.update(id, data);
    return await this.findById(id);
  }

  static async delete(id: number) {
    const empresa = await EmpresaQueries.findById(id);
    if (!empresa[0]) throw new NotFoundError("Empresa não encontrada");

    const [onibus] = await db.query(
      "SELECT id_onibus FROM Onibus WHERE id_empresa = ? LIMIT 1",
      [id],
    );
    if (onibus[0]) throw new ConflictError("Não é possível excluir: empresa possui ônibus vinculados");

    await EmpresaQueries.delete(id);
    return { message: "Empresa removida com sucesso" };
  }
}
