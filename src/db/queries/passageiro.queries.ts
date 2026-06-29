import { db, buildUpdate } from "../connection";

export class PassageiroQueries {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM Passageiro");
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.query(
      "SELECT * FROM Passageiro WHERE id_passageiro = ?",
      [id],
    );
    return rows;
  }

  static async findByCpf(cpf: string) {
    const cleaned = cpf.replace(/\D/g, "");
    const [rows] = await db.query(
      "SELECT * FROM Passageiro WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), '/', '') = ?",
      [cleaned],
    );
    return rows;
  }

  static async findByEmail(email: string) {
    const [rows] = await db.query(
      "SELECT * FROM Passageiro WHERE email = ?",
      [email],
    );
    return rows;
  }

  static async create(data: {
    nome: string;
    cpf: string;
    email: string;
    telefone?: string;
    data_nascimento?: string;
  }) {
    const [result] = await db.query(
      `INSERT INTO Passageiro (nome, cpf, email, telefone, data_nascimento)
       VALUES (?, ?, ?, ?, ?)`,
      [data.nome, data.cpf, data.email, data.telefone ?? null, data.data_nascimento ?? null],
    );
    return result;
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
    const { sql, values } = buildUpdate("Passageiro", data, "id_passageiro", id);
    if (values.length === 1) return;
    const [result] = await db.query(sql, values);
    return result;
  }

  static async delete(id: number) {
    const [result] = await db.query(
      "DELETE FROM Passageiro WHERE id_passageiro = ?",
      [id],
    );
    return result;
  }
}
