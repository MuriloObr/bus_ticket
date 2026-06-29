import { PassagemService } from "./passagem.service";
import { AppError } from "../../shared/errors";

export class PassagemController {
  static async index() { return await PassagemService.findAll(); }

  static async show({ params, set }: { params: { id: string }; set: any }) {
    try { return await PassagemService.findById(Number(params.id)); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async showByReserva({ params, set }: { params: { id: string }; set: any }) {
    try { return await PassagemService.findByReserva(Number(params.id)); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async store({ body, set }: { body: any; set: any }) {
    try { set.status = 201; return await PassagemService.create(body); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }
}
