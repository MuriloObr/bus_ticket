import { Elysia, t } from "elysia";
import { ReservaController } from "./reserva.controller";

const ReservaSchema = t.Object({
  id_reserva: t.Integer(),
  data_reserva: t.String(),
  numero_assento: t.Integer(),
  status: t.String({ enum: ['Confirmada', 'Cancelada', 'Pendente'] }),
  id_passageiro: t.Integer(),
  id_viagem: t.Integer(),
});

const CreateReservaSchema = t.Object({
  data_reserva: t.String({ format: 'date-time' }),
  numero_assento: t.Integer(),
  id_passageiro: t.Integer(),
  id_viagem: t.Integer(),
});

const UpdateReservaSchema = t.Object({
  numero_assento: t.Optional(t.Integer()),
  status: t.Optional(t.String({ enum: ['Confirmada', 'Cancelada', 'Pendente'] })),
});

const MessageSchema = t.Object({ message: t.String() });
const ErrorResponse = t.Object({ error: t.String() });

export const reservaRoutes = new Elysia({ prefix: "/reservas", tags: ["Reserva"] })
  .get("/", () => ReservaController.index(), { response: { 200: t.Array(ReservaSchema) } })
  .get("/passageiro/:id", ({ params, set }) => ReservaController.showByPassageiro({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Array(ReservaSchema) },
  })
  .get("/viagem/:id", ({ params, set }) => ReservaController.showByViagem({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Array(ReservaSchema) },
  })
  .get("/:id", ({ params, set }) => ReservaController.show({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: ReservaSchema },
  })
  .post("/", ({ body, set }) => ReservaController.store({ body, set }), {
    body: CreateReservaSchema,
    response: { 201: ReservaSchema },
  })
  .put("/:id", ({ params, body, set }) => ReservaController.update({ params, body, set }), {
    params: t.Object({ id: t.String() }),
    body: UpdateReservaSchema,
    response: { 200: ReservaSchema },
  })
  .delete("/:id", ({ params, set }) => ReservaController.destroy({ params, set }), {
    params: t.Object({ id: t.String() }),
    response: { 200: t.Union([MessageSchema, ErrorResponse]) },
  });
