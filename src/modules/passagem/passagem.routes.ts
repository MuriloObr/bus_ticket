import { Elysia, t } from "elysia";
import { PassagemController } from "./passagem.controller";

const PassagemSchema = t.Object({
  id_passagem: t.Integer(),
  codigo_embarque: t.String(),
  data_emissao: t.String(),
  id_reserva: t.Integer(),
});

const CreatePassagemSchema = t.Object({
  data_emissao: t.String({ format: 'date-time' }),
  id_reserva: t.Integer(),
});

export const passagemRoutes = new Elysia({ prefix: "/passagens", tags: ["Passagem"] })
  .get("/", () => PassagemController.index(), { response: { 200: t.Array(PassagemSchema) } })
  .get("/reserva/:id", ({ params, set }) => PassagemController.showByReserva({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Array(PassagemSchema) },
  })
  .get("/:id", ({ params, set }) => PassagemController.show({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: PassagemSchema },
  })
  .post("/", ({ body, set }) => PassagemController.store({ body, set }), {
    body: CreatePassagemSchema,
    response: { 201: PassagemSchema },
  });
