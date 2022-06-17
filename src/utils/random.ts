export const randomSpeed = (
  minSpeed: number = 0,
  maxSpeed: number
): number | null => {
  if (!maxSpeed || maxSpeed < 1) return null;
  return (
    Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed
  );
};
