export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type ToastPayload = {
  message: string;
  tone?: "default" | "error" | "success";
};

export function dispatchToast(payload: ToastPayload) {
  if (typeof window === "undefined") {
    return;
  }
  const event = new CustomEvent("app:toast", {
    detail: payload
  });
  document.dispatchEvent(event);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}
