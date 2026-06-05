import { http, HttpResponse } from "msw";

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
];