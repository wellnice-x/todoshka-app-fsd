import type { PropsWithChildren } from "react";

import Todo from "./Todo";
import { TasksStrategyProvider } from "@/features/tasks-management";
import { AuthProvider } from "@/shared/auth";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import userEvent from "@testing-library/user-event";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: PropsWithChildren) => (
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TasksStrategyProvider>{children}</TasksStrategyProvider>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
);

const renderTodo = async () => {
  render(<Todo />, { wrapper });

  await waitFor(() => {
    expect(screen.queryByTitle(/init loading/i)).not.toBeInTheDocument();
  });
};

const addTask = async (title: string) => {
  const input = screen.getByRole("textbox", { name: /task title/i });
  const createButton = screen.getByRole("button", { name: /create/i });

  await userEvent.type(input, title);
  await userEvent.click(createButton);

  return screen.findByText(title);
};

describe("Todo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adds new task", async () => {
    await renderTodo();

    expect(await addTask("Buy milk")).toBeInTheDocument();
  });

  it("toggles task completion", async () => {
    const user = userEvent.setup();

    await renderTodo();

    expect(await addTask("Buy milk")).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox", {
      name: /toggle task completion/i,
    });

    const newTaskCheckbox = checkboxes[checkboxes.length - 1];

    await user.click(newTaskCheckbox);

    expect(newTaskCheckbox).toBeChecked();
  });

  it("deletes task", async () => {
    const user = userEvent.setup();

    await renderTodo();

    expect(await addTask("Buy milk")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete task/i,
    });

    const newTaskDeleteButton = deleteButtons[deleteButtons.length - 1];

    await user.click(newTaskDeleteButton);

    await waitForElementToBeRemoved(() => screen.queryByText("Buy milk"));

    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
  });

  it("searches task", async () => {
    const user = userEvent.setup();

    await renderTodo();

    expect(await addTask("Buy milk")).toBeInTheDocument();

    const searchField = screen.getByLabelText("search query by title");

    await user.type(searchField, "X");

    await waitFor(() => {
      expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
    });

    await userEvent.clear(searchField);

    await user.type(searchField, "Buy");

    expect(await screen.findByText("Buy milk")).toBeInTheDocument();
  });

  it("shows no task stub", async () => {
    await renderTodo();

    expect(screen.getByText("No tasks")).toBeInTheDocument();

    expect(await addTask("Buy milk")).toBeInTheDocument();

    expect(screen.queryByText("No tasks")).not.toBeInTheDocument();
  });

  it("filters tasks", async () => {
    const user = userEvent.setup();

    await renderTodo();

    expect(await addTask("Buy milk")).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox", {
      name: /toggle task completion/i,
    });

    const newTaskCheckbox = checkboxes[checkboxes.length - 1];

    await user.click(newTaskCheckbox);

    expect(newTaskCheckbox).toBeChecked();

    const activeButton = screen.getByRole("button", {
      name: /active/i,
    });

    await user.click(activeButton);

    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();

    const completedButton = screen.getByRole("button", {
      name: /^completed$/i,
    });

    await user.click(completedButton);

    expect(await screen.findByText("Buy milk")).toBeInTheDocument();
  });

  it("deletes completed tasks", async () => {
    const user = userEvent.setup();

    await renderTodo();

    expect(await addTask("Buy milk")).toBeInTheDocument();

    expect(await addTask("Buy cat food")).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox", {
      name: /toggle task completion/i,
    });

    await user.click(checkboxes[checkboxes.length - 1]);
    await user.click(checkboxes[checkboxes.length - 2]);

    expect(checkboxes[checkboxes.length - 1]).toBeChecked();
    expect(checkboxes[checkboxes.length - 2]).toBeChecked();

    const deleteCompletedButton = screen.getByRole("button", {
      name: /delete completed/i,
    });

    await user.click(deleteCompletedButton);

    await screen.findByText(
      /are you sure you want to delete all completed tasks/i,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
      expect(screen.queryByText("Buy cat food")).not.toBeInTheDocument();
    });
  });

  it("marks all tasks completed", async () => {
    const user = userEvent.setup();

    await renderTodo();

    expect(await addTask("Buy milk")).toBeInTheDocument();

    expect(await addTask("Buy cat food")).toBeInTheDocument();

    const markAllButton = screen.getByRole("button", {
      name: /complete all/i,
    });

    await user.click(markAllButton);

    await screen.findByText(
      /are you sure you want to mark all tasks as completed/i,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    const checkboxes = screen.getAllByRole("checkbox", {
      name: /toggle task completion/i,
    });

    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });
});
