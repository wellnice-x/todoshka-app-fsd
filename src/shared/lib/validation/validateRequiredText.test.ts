import { validateRequiredText } from "./validateRequiredText";

describe("validateRequiredText", () => {
  it("accepts a valid text value", () => {
    expect(validateRequiredText("John")).toBe("");
  });

  it("accepts a valid text value with spaces on different sides", () => {
    expect(validateRequiredText("  John  ")).toBe("");
  });

  it("returns an error for a text value containing only spaces", () => {
    expect(validateRequiredText("   ")).toBe(
      "The field cannot contain only spaces",
    );
  });

  it("returns an error for an empty text value", () => {
    expect(validateRequiredText("")).toBe("The field cannot be empty");
  });
});
