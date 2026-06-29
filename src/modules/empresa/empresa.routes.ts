import { Elysia, t } from "elysia";
import { EmpresaController } from "./empresa.controller";

const EmpresaSchema = t.Object({
  id_empresa: t.Integer(),
  nome: t.String(),
  cnpj: t.String(),
  telefone: t.Nullable(t.String()),
  email: t.Nullable(t.String({ format: 'email' })),
});

const CreateEmpresaSchema = t.Object({
  nome: t.String({ maxLength: 100 }),
  cnpj: t.String({ maxLength: 18 }),
  telefone: t.Optional(t.String({ maxLength: 20 })),
  email: t.Optional(t.String({ format: 'email', maxLength: 100 })),
});

const UpdateEmpresaSchema = t.Object({
  nome: t.Optional(t.String({ maxLength: 100 })),
  cnpj: t.Optional(t.String({ maxLength: 18 })),
  telefone: t.Optional(t.String({ maxLength: 20 })),
  email: t.Optional(t.String({ format: 'email', maxLength: 100 })),
});

const MessageSchema = t.Object({ message: t.String() });
const ErrorResponse = t.Object({ error: t.String() });

export const empresaRoutes = new Elysia({ prefix: "/empresas", tags: ["Empresa"] })
  .get("/", () => EmpresaController.index(), { response: { 200: t.Array(EmpresaSchema) } })
  .get("/:id", ({ params, set }) => EmpresaController.show({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: EmpresaSchema },
  })
  .post("/", ({ body, set }) => EmpresaController.store({ body, set }), {
    body: CreateEmpresaSchema,
    response: { 201: EmpresaSchema },
  })
  .put("/:id", ({ params, body, set }) => EmpresaController.update({ params, body, set }), {
    params: t.Object({ id: t.String() }),
    body: UpdateEmpresaSchema,
    response: { 200: EmpresaSchema },
  })
  .delete("/:id", ({ params, set }) => EmpresaController.destroy({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Union([MessageSchema, ErrorResponse]) },
  });
