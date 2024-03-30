export const randomSpeed = (
  minSpeed?: number,
  maxSpeed?: number,
): number | null => {
  if (!maxSpeed || maxSpeed < 1) return null;
  return (
    Math.floor(Math.random() * (maxSpeed - (minSpeed || 0) + 1)) + (minSpeed || 0)
  );
};
