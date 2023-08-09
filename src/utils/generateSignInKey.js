function generateSignInKey() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-?@';
  let key = '';

  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    key += charset[randomIndex];
  }

  return key;
}

module.exports = { generateSignInKey }