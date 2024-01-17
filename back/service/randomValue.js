function getRandomId(idLength = 15) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let id = '';

  while (id.length < idLength) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return id;
}

module.exports = getRandomId;
