import { PagamentoService } from "./pagamento.service";
import { AppError } from "../../shared/errors";

export class PagamentoController {
  static async index() { return await PagamentoService.findAll(); }

  static async show({ params, set }: { params: { id: string }; set: any }) {
    try { return await PagamentoService.findById(Number(params.id)); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async showByReserva({ params, set }: { params: { id: string }; set: any }) {
    try { return await PagamentoService.findByReserva(Number(params.id)); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async store({ body, set }: { body: any; set: any }) {
    try { set.status = 201; return await PagamentoService.create(body); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }
}
