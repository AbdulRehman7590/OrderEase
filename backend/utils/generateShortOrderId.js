function generateShortOrderId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array.from(
    { length: 3 },
    () => letters[Math.floor(Math.random() * letters.length)]
  ).join("");

  const randomNumbers = Math.floor(100 + Math.random() * 900); 

  return `${randomLetters}-${randomNumbers}`;
}

module.exports = generateShortOrderId;
