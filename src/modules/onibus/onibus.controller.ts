import { OnibusService } from "./onibus.service";
import { AppError } from "../../shared/errors";

export class OnibusController {
  static async index() { return await OnibusService.findAll(); }

  static async show({ params, set }: { params: { id: string }; set: any }) {
    try { return await OnibusService.findById(Number(params.id)); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async showByEmpresa({ params, set }: { params: { id: string }; set: any }) {
    try { return await OnibusService.findByEmpresa(Number(params.id)); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async store({ body, set }: { body: any; set: any }) {
    try { set.status = 201; return await OnibusService.create(body); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async update({ params, body, set }: { params: { id: string }; body: any; set: any }) {
    try { return await OnibusService.update(Number(params.id), body); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }

  static async destroy({ params, set }: { params: { id: string }; set: any }) {
    try { return await OnibusService.delete(Number(params.id)); }
    catch (error) {
      if (error instanceof AppError) { set.status = error.statusCode; return { error: error.message }; }
      console.error(error); set.status = 500; return { error: "Erro interno" };
    }
  }
}
