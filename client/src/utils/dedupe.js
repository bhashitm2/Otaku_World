// Deduplicate a list of API items by mal_id (or id), preserving order.
// The trending endpoint aggregates several Jikan sources and can return the
// same title more than once, which otherwise triggers React duplicate-key
// warnings when the array is rendered.
export const dedupeById = (items = []) => {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const id = item?.mal_id ?? item?.id;
    if (id == null || seen.has(id)) continue;
    seen.add(id);
    result.push(item);
  }
  return result;
};
