import { Elysia, ValidationError } from "elysia";
import { AppError } from "./shared/errors";
import { openapi } from "@elysia/openapi";
import { passageiroRoutes } from "./modules/passageiro/passageiro.routes";
import { reservaRoutes } from "./modules/reserva/reserva.routes";
import { cidadeRoutes } from "./modules/cidade/cidade.routes";
import { empresaRoutes } from "./modules/empresa/empresa.routes";
import { onibusRoutes } from "./modules/onibus/onibus.routes";
import { rotaRoutes } from "./modules/rota/rota.routes";
import { viagemRoutes } from "./modules/viagem/viagem.routes";
import { pagamentoRoutes } from "./modules/pagamento/pagamento.routes";
import { passagemRoutes } from "./modules/passagem/passagem.routes";

const app = new Elysia()
  .onError(({ error, set }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return { error: error.message };
    }
    if (error instanceof ValidationError) {
      set.status = 422;
      const details = error.all.map((e) => ({
        field: e.path?.replace("/", "") || "unknown",
        message: e.message || e.summary,
      }));
      return { error: "Validation failed", details };
    }

    console.error("[500]", error);
    set.status = 500;
    return { error: "Erro interno" };
  })
  .onRequest(({ request }) => {
    console.log(`${request.method} - ${new URL(request.url).pathname}`);
  })
  .use(openapi())
  .use(passageiroRoutes)
  .use(reservaRoutes)
  .use(cidadeRoutes)
  .use(empresaRoutes)
  .use(onibusRoutes)
  .use(rotaRoutes)
  .use(viagemRoutes)
  .use(pagamentoRoutes)
  .use(passagemRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
