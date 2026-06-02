import Field from "./Field";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Field", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("connects input with error message through aria attributes", async () => {
    render(<Field label="Task title" multiline={false} error="Any error" />);

    const input = screen.getByRole("textbox");

    const errorSpan = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");

    expect(input).toHaveAttribute("aria-errormessage", errorSpan.id);
  });

  it("doesn't render error span when there's no error", async () => {
    render(<Field label="Task title" multiline={false} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("calls endIconButtonClick when it is clicked", async () => {
    const handleClick = vi.fn();

    render(
      <Field
        label="Password"
        multiline={false}
        endIconButton={<span>👁</span>}
        endIconButtonAriaLabel="Toggle password visibility"
        endIconButtonClick={handleClick}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /toggle password visibility/i }),
    );

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
