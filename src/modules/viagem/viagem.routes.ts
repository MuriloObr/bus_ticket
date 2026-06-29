import { Elysia, t } from "elysia";
import { ViagemController } from "./viagem.controller";

const ViagemSchema = t.Object({
  id_viagem: t.Integer(),
  data_partida: t.String(),
  data_chegada: t.String(),
  valor_passagem: t.Number(),
  id_rota: t.Integer(),
  id_onibus: t.Integer(),
});

const CreateViagemSchema = t.Object({
  data_partida: t.String({ format: 'date-time' }),
  data_chegada: t.String({ format: 'date-time' }),
  valor_passagem: t.Number(),
  id_rota: t.Integer(),
  id_onibus: t.Integer(),
});

const UpdateViagemSchema = t.Object({
  data_partida: t.Optional(t.String({ format: 'date-time' })),
  data_chegada: t.Optional(t.String({ format: 'date-time' })),
  valor_passagem: t.Optional(t.Number()),
});

const MessageSchema = t.Object({ message: t.String() });
const ErrorResponse = t.Object({ error: t.String() });

export const viagemRoutes = new Elysia({ prefix: "/viagens", tags: ["Viagem"] })
  .get("/", () => ViagemController.index(), { response: { 200: t.Array(ViagemSchema) } })
  .get("/rota/:id", ({ params, set }) => ViagemController.showByRota({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Array(ViagemSchema) },
  })
  .get("/onibus/:id", ({ params, set }) => ViagemController.showByOnibus({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Array(ViagemSchema) },
  })
  .get("/:id", ({ params, set }) => ViagemController.show({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: ViagemSchema },
  })
  .post("/", ({ body, set }) => ViagemController.store({ body, set }), {
    body: CreateViagemSchema,
    response: { 201: ViagemSchema },
  })
  .put("/:id", ({ params, body, set }) => ViagemController.update({ params, body, set }), {
    params: t.Object({ id: t.String() }),
    body: UpdateViagemSchema,
    response: { 200: ViagemSchema },
  })
  .delete("/:id", ({ params, set }) => ViagemController.destroy({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Union([MessageSchema, ErrorResponse]) },
  });
