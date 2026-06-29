import { Elysia, t } from "elysia";
import { PassageiroController } from "./passageiro.controller";

const PassageiroSchema = t.Object({
  id_passageiro: t.Integer(),
  nome: t.String(),
  cpf: t.String(),
  email: t.String({ format: 'email' }),
  telefone: t.Nullable(t.String()),
  data_nascimento: t.Nullable(t.String({ format: 'date' })),
});

const CreatePassageiroSchema = t.Object({
  nome: t.String({ maxLength: 100 }),
  cpf: t.String({ maxLength: 14 }),
  email: t.String({ format: 'email', maxLength: 100 }),
  telefone: t.Optional(t.String({ maxLength: 20 })),
  data_nascimento: t.Optional(t.String({ format: 'date' })),
});

const UpdatePassageiroSchema = t.Object({
  nome: t.Optional(t.String({ maxLength: 100 })),
  cpf: t.Optional(t.String({ maxLength: 14 })),
  email: t.Optional(t.String({ format: 'email', maxLength: 100 })),
  telefone: t.Optional(t.String({ maxLength: 20 })),
  data_nascimento: t.Optional(t.String({ format: 'date' })),
});

const MessageSchema = t.Object({ message: t.String() });
const ErrorResponse = t.Object({ error: t.String() });

export const passageiroRoutes = new Elysia({ prefix: "/passageiros", tags: ["Passageiro"] })
  .get("/", () => PassageiroController.index(), { response: { 200: t.Array(PassageiroSchema) } })
  .get("/:id", ({ params, set }) => PassageiroController.show({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: PassageiroSchema },
  })
  .post("/", ({ body, set }) => PassageiroController.store({ body, set }), {
    body: CreatePassageiroSchema,
    response: { 201: PassageiroSchema },
  })
  .put("/:id", ({ params, body, set }) => PassageiroController.update({ params, body, set }), {
    params: t.Object({ id: t.String() }),
    body: UpdatePassageiroSchema,
    response: { 200: PassageiroSchema },
  })
  .delete("/:id", ({ params, set }) => PassageiroController.destroy({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Union([MessageSchema, ErrorResponse]) },
  });
