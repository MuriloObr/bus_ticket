import { Elysia, t } from "elysia";
import { CidadeController } from "./cidade.controller";

const CidadeSchema = t.Object({
  id_cidade: t.Integer(),
  nome: t.String(),
  estado: t.String(),
});

const CreateCidadeSchema = t.Object({
  nome: t.String({ maxLength: 100 }),
  estado: t.String({ minLength: 2, maxLength: 2 }),
});

const UpdateCidadeSchema = t.Object({
  nome: t.Optional(t.String({ maxLength: 100 })),
  estado: t.Optional(t.String({ minLength: 2, maxLength: 2 })),
});

const MessageSchema = t.Object({ message: t.String() });
const ErrorResponse = t.Object({ error: t.String() });

export const cidadeRoutes = new Elysia({ prefix: "/cidades", tags: ["Cidade"] })
  .get("/", () => CidadeController.index(), { response: { 200: t.Array(CidadeSchema) } })
  .get("/:id", ({ params, set }) => CidadeController.show({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: CidadeSchema },
  })
  .post("/", ({ body, set }) => CidadeController.store({ body, set }), {
    body: CreateCidadeSchema,
    response: { 201: CidadeSchema },
  })
  .put("/:id", ({ params, body, set }) => CidadeController.update({ params, body, set }), {
    params: t.Object({ id: t.String() }),
    body: UpdateCidadeSchema,
    response: { 200: CidadeSchema },
  })
  .delete("/:id", ({ params, set }) => CidadeController.destroy({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Union([MessageSchema, ErrorResponse]) },
  });
