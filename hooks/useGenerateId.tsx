export const useGenerateNumericId = () => {
  const firstDigit = Math.floor(1 + Math.random() * 9).toString();
  const timestampPart = Date.now().toString().slice(-2);
  const randomPart = Math.floor(100 + Math.random() * 9000).toString();
  return firstDigit + timestampPart + randomPart;
}
