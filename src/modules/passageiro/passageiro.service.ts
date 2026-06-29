import { PassageiroQueries } from "../../db/queries/passageiro.queries";
import { NotFoundError, ConflictError, BadRequestError } from "../../shared/errors";
import { isValidCPF, stripCPF, formatCPF } from "../../shared/utils";
import { toMySQLDate } from "../../shared/utils/date";

export class PassageiroService {
  static async findAll() {
    return await PassageiroQueries.findAll();
  }

  static async findById(id: number) {
    const rows = await PassageiroQueries.findById(id);
    if (!rows[0]) throw new NotFoundError("Passageiro não encontrado");
    return rows[0];
  }

  static async create(data: {
    nome: string;
    cpf: string;
    email: string;
    telefone?: string;
    data_nascimento?: string;
  }) {
    if (!isValidCPF(data.cpf)) throw new BadRequestError("CPF inválido");

    const cpfClean = stripCPF(data.cpf);
    const cpfExists = await PassageiroQueries.findByCpf(cpfClean);
    if (cpfExists[0]) throw new ConflictError("CPF já cadastrado");

    const emailExists = await PassageiroQueries.findByEmail(data.email);
    if (emailExists[0]) throw new ConflictError("Email já cadastrado");

    const normalized = {
      ...data,
      cpf: formatCPF(cpfClean),
      ...(data.data_nascimento !== undefined && { data_nascimento: toMySQLDate(data.data_nascimento) }),
    };
    const result = await PassageiroQueries.create(normalized);
    return await this.findById(result.insertId);
  }

  static async update(
    id: number,
    data: {
      nome?: string;
      cpf?: string;
      email?: string;
      telefone?: string;
      data_nascimento?: string;
    },
  ) {
    const passageiro = await PassageiroQueries.findById(id);
    if (!passageiro[0]) throw new NotFoundError("Passageiro não encontrado");

    if (data.cpf !== undefined && stripCPF(data.cpf) !== stripCPF(passageiro[0].cpf)) {
      if (!isValidCPF(data.cpf)) throw new BadRequestError("CPF inválido");
      const cpfExists = await PassageiroQueries.findByCpf(data.cpf);
      if (cpfExists[0]) throw new ConflictError("CPF já cadastrado");
      data.cpf = formatCPF(stripCPF(data.cpf));
    }

    if (data.email !== undefined && data.email !== passageiro[0].email) {
      const emailExists = await PassageiroQueries.findByEmail(data.email);
      if (emailExists[0]) throw new ConflictError("Email já cadastrado");
    }

    const normalized = {
      ...data,
      ...(data.data_nascimento !== undefined && { data_nascimento: toMySQLDate(data.data_nascimento) }),
    };
    await PassageiroQueries.update(id, normalized);
    return await this.findById(id);
  }

  static async delete(id: number) {
    const passageiro = await PassageiroQueries.findById(id);
    if (!passageiro[0]) throw new NotFoundError("Passageiro não encontrado");

    await PassageiroQueries.delete(id);
    return { message: "Passageiro removido com sucesso" };
  }
}
