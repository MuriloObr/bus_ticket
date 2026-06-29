import { PassageiroService } from "./passageiro.service";
import { AppError } from "../../shared/errors";

export class PassageiroController {
  static async index() {
    return await PassageiroService.findAll();
  }

  static async show({ params, set }: { params: { id: string }; set: any }) {
    try {
      return await PassageiroService.findById(Number(params.id));
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async store({ body, set }: { body: any; set: any }) {
    try {
      const passageiro = await PassageiroService.create(body);
      set.status = 201;
      return passageiro;
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async update({ params, body, set }: { params: { id: string }; body: any; set: any }) {
    try {
      return await PassageiroService.update(Number(params.id), body);
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async destroy({ params, set }: { params: { id: string }; set: any }) {
    try {
      return await PassageiroService.delete(Number(params.id));
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }
}
