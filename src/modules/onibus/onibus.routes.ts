import { Elysia, t } from "elysia";
import { OnibusController } from "./onibus.controller";

const OnibusSchema = t.Object({
  id_onibus: t.Integer(),
  placa: t.String(),
  modelo: t.Nullable(t.String()),
  capacidade: t.Integer(),
  id_empresa: t.Integer(),
});

const CreateOnibusSchema = t.Object({
  placa: t.String({ maxLength: 10 }),
  modelo: t.Optional(t.String({ maxLength: 100 })),
  capacidade: t.Integer(),
  id_empresa: t.Integer(),
});

const UpdateOnibusSchema = t.Object({
  placa: t.Optional(t.String({ maxLength: 10 })),
  modelo: t.Optional(t.String({ maxLength: 100 })),
  capacidade: t.Optional(t.Integer()),
});

const MessageSchema = t.Object({ message: t.String() });
const ErrorResponse = t.Object({ error: t.String() });

export const onibusRoutes = new Elysia({ prefix: "/onibus", tags: ["Ônibus"] })
  .get("/", () => OnibusController.index(), { response: { 200: t.Array(OnibusSchema) } })
  .get("/empresa/:id", ({ params, set }) => OnibusController.showByEmpresa({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Array(OnibusSchema) },
  })
  .get("/:id", ({ params, set }) => OnibusController.show({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: OnibusSchema },
  })
  .post("/", ({ body, set }) => OnibusController.store({ body, set }), {
    body: CreateOnibusSchema,
    response: { 201: OnibusSchema },
  })
  .put("/:id", ({ params, body, set }) => OnibusController.update({ params, body, set }), {
    params: t.Object({ id: t.String() }),
    body: UpdateOnibusSchema,
    response: { 200: OnibusSchema },
  })
  .delete("/:id", ({ params, set }) => OnibusController.destroy({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Union([MessageSchema, ErrorResponse]) },
  });
