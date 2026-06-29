import { Elysia, t } from "elysia";
import { RotaController } from "./rota.controller";

const RotaSchema = t.Object({
  id_rota: t.Integer(),
  distancia_km: t.Nullable(t.Number()),
  tempo_estimado: t.Nullable(t.String()),
  id_cidade_origem: t.Integer(),
  id_cidade_destino: t.Integer(),
});

const CreateRotaSchema = t.Object({
  distancia_km: t.Optional(t.Number()),
  tempo_estimado: t.Optional(t.String({ maxLength: 30 })),
  id_cidade_origem: t.Integer(),
  id_cidade_destino: t.Integer(),
});

const UpdateRotaSchema = t.Object({
  distancia_km: t.Optional(t.Number()),
  tempo_estimado: t.Optional(t.String({ maxLength: 30 })),
});

const MessageSchema = t.Object({ message: t.String() });
const ErrorResponse = t.Object({ error: t.String() });

export const rotaRoutes = new Elysia({ prefix: "/rotas", tags: ["Rota"] })
  .get("/", () => RotaController.index(), { response: { 200: t.Array(RotaSchema) } })
  .get("/:id", ({ params, set }) => RotaController.show({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: RotaSchema },
  })
  .post("/", ({ body, set }) => RotaController.store({ body, set }), {
    body: CreateRotaSchema,
    response: { 201: RotaSchema },
  })
  .put("/:id", ({ params, body, set }) => RotaController.update({ params, body, set }), {
    params: t.Object({ id: t.String() }),
    body: UpdateRotaSchema,
    response: { 200: RotaSchema },
  })
  .delete("/:id", ({ params, set }) => RotaController.destroy({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Union([MessageSchema, ErrorResponse]) },
  });
