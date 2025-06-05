export function createCard(data, handleDeleteCard, handleLikeClick, handleImageClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const title = cardElement.querySelector('.card__title');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  title.textContent = data.name;

  likeButton.addEventListener('click', () => {
    handleLikeClick(likeButton); // 👈 тут имя аргумента должно совпадать
  });

  deleteButton.addEventListener('click', () => {
    handleDeleteCard(cardElement);
  });

  cardImage.addEventListener('click', () => {
    handleImageClick(data);
  });

  return cardElement;
}

export function handleDeleteCard(cardElement) {
  cardElement.remove();
}
