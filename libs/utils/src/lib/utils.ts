export const FILE_SERVICE = process.env.NX_FILE_SERVER_URL;

export function roundToHalf(num: number) {
  if (num % 1 >= 0.6) return Math.ceil(num);
  return Math.floor(num);
}
