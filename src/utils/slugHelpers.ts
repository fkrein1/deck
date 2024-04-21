function createSlug({ id, title }: { id: string; title: string }) {
  const formattedTitle = title
    .toLowerCase()
    .replace(/[-:,&\s]+/g, "-") // Replace consecutive occurrences of special characters with a single hyphen
    .replace(/[^a-z0-9-]/g, "") // Remove any characters that are not lowercase alphabets, numbers, or hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
  return encodeURI(`${formattedTitle}-${id}`);
}

function getIdfromSlug({ slug }: { slug: string }) {
  const parts = slug.split("-");
  const id = parts.pop();
  return id as string;
}

export { createSlug, getIdfromSlug };
