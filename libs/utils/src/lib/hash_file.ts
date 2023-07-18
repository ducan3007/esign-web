export const hash_file = (file: any) => {
  const { name, size, type } = file;

  return `${name}${size}${type}`.trim().replace(/\s/g, '_');
};
