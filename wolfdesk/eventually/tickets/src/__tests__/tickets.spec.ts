import { app, client, dispose } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { openTicket } from "./commands";
import { Tickets } from "../ticket.projector";

const chance = new Chance();

describe("tickets projector", () => {
  beforeAll(() => {
    app().with(Ticket).with(Tickets).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should project tickets", async () => {
    const ticketId = chance.guid();
    await openTicket(ticketId, "assign me", "Opening a new ticket");
    const count = await client().read(Tickets, ticketId, (p) =>
      expect(p.state.id).toBeDefined()
    );
    expect(count).toBe(1);
  });
});
