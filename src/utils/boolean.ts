const isTrueFalse = (
  value: null | undefined | boolean | string | string[]
): boolean | undefined => {
  if (value === null || value === undefined || Array.isArray(value))
    return undefined;
  if (typeof value === "boolean") return value;
  return value === "true";
};

export { isTrueFalse };
