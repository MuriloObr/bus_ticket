import { ReservaService } from "./reserva.service";
import { AppError } from "../../shared/errors";

export class ReservaController {
  static async index() {
    return await ReservaService.findAll();
  }

  static async show({ params, set }: { params: { id: string }; set: any }) {
    try {
      return await ReservaService.findById(Number(params.id));
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async showByPassageiro({ params, set }: { params: { id: string }; set: any }) {
    try {
      return await ReservaService.findByPassageiro(Number(params.id));
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async showByViagem({ params, set }: { params: { id: string }; set: any }) {
    try {
      return await ReservaService.findByViagem(Number(params.id));
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async store({ body, set }: { body: any; set: any }) {
    try {
      const reserva = await ReservaService.create(body);
      set.status = 201;
      return reserva;
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async update({ params, body, set }: { params: { id: string }; body: any; set: any }) {
    try {
      return await ReservaService.update(Number(params.id), body);
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async destroy({ params, set }: { params: { id: string }; set: any }) {
    try {
      return await ReservaService.delete(Number(params.id));
    } catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }
}
