import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import UserDrawer from "./UserDrawer";
import type { User } from "../types";

const user: User = {
  id: 7,
  name: "Priya Patel",
  status: "active",
  revenue: 175,
  email: "priya@example.com",
  company: "Northstar Labs",
};

afterEach(cleanup);

describe("UserDrawer edit workflow", () => {
  it("submits validated edits and returns to the refreshed user details", async () => {
    const actor = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(
      <UserDrawer user={user} onClose={vi.fn()} onSave={onSave} isSaving={false} />,
    );

    await actor.click(screen.getByRole("button", { name: "Edit user" }));
    await actor.clear(screen.getByLabelText("Name"));
    await actor.type(screen.getByLabelText("Name"), "Priya Sharma");
    await actor.clear(screen.getByLabelText("Company"));
    await actor.type(screen.getByLabelText("Company"), "Meridian Labs");
    await actor.selectOptions(screen.getByLabelText("Status"), "inactive");
    await actor.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(7, {
      name: "Priya Sharma",
      email: "priya@example.com",
      company: "Meridian Labs",
      status: "inactive",
    }));
    rerender(
      <UserDrawer
        user={{ ...user, name: "Priya Sharma", company: "Meridian Labs", status: "inactive" }}
        onClose={vi.fn()}
        onSave={onSave}
        isSaving={false}
      />,
    );
    expect(await screen.findByRole("heading", { name: "Priya Sharma" })).toBeInTheDocument();
    expect(screen.getByText("Inactive account")).toBeInTheDocument();
  });

  it("keeps the form open and explains a save failure", async () => {
    const actor = userEvent.setup();
    const onSave = vi.fn().mockRejectedValue(new Error("Could not save user"));
    render(<UserDrawer user={user} onClose={vi.fn()} onSave={onSave} isSaving={false} />);

    await actor.click(screen.getByRole("button", { name: "Edit user" }));
    await actor.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Could not save user");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
