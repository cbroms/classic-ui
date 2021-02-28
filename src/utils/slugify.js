export const slugify = (string) => {
  return string.replace(/ /g, "-").toLowerCase();
};
