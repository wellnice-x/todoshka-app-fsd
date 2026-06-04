import { tasksService } from "@/entities/task";
import { supabase } from "@/shared/api";
import { deleteServerUserData } from "./deleteUserAccount";

vi.mock("@/entities/task", () => ({
  tasksService: {
    deleteAll: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@/shared/api", () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({
        error: null,
      }),
    },
  },
}));

describe("deleteUserAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls deleteAll and signOut functions", async () => {
    await deleteServerUserData();

    expect(tasksService.deleteAll).toHaveBeenCalled();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
