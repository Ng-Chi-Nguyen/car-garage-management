export function applyReceivablesSearchParams(prev, value) {
  const next = new URLSearchParams(prev);
  if (value) next.set("search", value);
  else next.delete("search");
  next.delete("q");
  next.set("page", "1");
  return next;
}
