export const isValidObjectId = (id: string) => {
  const objectIdPattern = /^[a-f\d]{24}$/i; // Regex to check for 24-character hex string
  return objectIdPattern.test(id);
};
