import { http, HttpResponse, delay } from "msw";

let nextId = 1;

export const handlers = [
  http.get("*/tasks", () => {
    return HttpResponse.json([
      {
        id: "1",
        title: "Test MSW",
        description: "",
        is_done: false,
        order_index: 1,
        created_at: new Date().toISOString(),
      },
    ]);
  }),
  http.post("*/tasks", async () => {
    await delay(150);

    return HttpResponse.json([
      {
        id: `server-id-${String(nextId++)}`,
        title: "New task",
        description: "",
        is_done: false,
        order_index: nextId - 1,
        created_at: new Date().toISOString(),
      },
    ]);
  }),
  http.delete("*/tasks", async () => {
    await delay(150);

    return new HttpResponse(null, {
      status: 204,
    });
  }),
  http.patch("*/tasks", async () => {
    await delay(150);

    return new HttpResponse(null, {
      status: 204,
    });
  }),
];
