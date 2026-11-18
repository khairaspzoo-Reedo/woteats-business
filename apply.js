const API = "https://woteats.com/api/apply";

document.querySelectorAll("form[data-kind]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const note = form.querySelector("[data-note]");
    const data = Object.fromEntries(new FormData(form).entries());
    data.kind = form.dataset.kind;
    data.agreed = Boolean(form.querySelector("[name=agreed]")?.checked);
    if (form.dataset.kind === "courier") {
      data.rightToWork = Boolean(form.querySelector("[name=rightToWork]")?.checked);
    }
    if (!data.invoiceEmail) data.invoiceEmail = data.email;
    note.textContent = "Saving…";
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not save that.");
      form.reset();
      note.textContent = `Saved as #${body.id}. We will write to that email.`;
    } catch (error) {
      note.textContent = error instanceof Error ? error.message : "Could not save that.";
    }
  });
});
