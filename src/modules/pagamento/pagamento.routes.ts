import { Elysia, t } from "elysia";
import { PagamentoController } from "./pagamento.controller";

const PagamentoSchema = t.Object({
  id_pagamento: t.Integer(),
  data_pagamento: t.String(),
  valor: t.Number(),
  metodo_pagamento: t.Nullable(t.String()),
  status: t.Nullable(t.String({ enum: ['Pago', 'Pendente', 'Cancelado'] })),
  id_reserva: t.Integer(),
});

const CreatePagamentoSchema = t.Object({
  data_pagamento: t.String({ format: 'date-time' }),
  valor: t.Number(),
  metodo_pagamento: t.Optional(t.String({ maxLength: 50 })),
  id_reserva: t.Integer(),
});

export const pagamentoRoutes = new Elysia({ prefix: "/pagamentos", tags: ["Pagamento"] })
  .get("/", () => PagamentoController.index(), { response: { 200: t.Array(PagamentoSchema) } })
  .get("/reserva/:id", ({ params, set }) => PagamentoController.showByReserva({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Array(PagamentoSchema) },
  })
  .get("/:id", ({ params, set }) => PagamentoController.show({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: PagamentoSchema },
  })
  .post("/", ({ body, set }) => PagamentoController.store({ body, set }), {
    body: CreatePagamentoSchema,
    response: { 201: PagamentoSchema },
  });
