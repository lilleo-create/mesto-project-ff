import { deleteCardFromServer } from './api.js';

export function createCard(
  data,
  handleDeleteCard,
  handleLikeClick,
  handleImageClick,
  currentUserId,
  onLikeToggle
) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true).querySelector('.card');

  cardElement.dataset.cardId = data._id;

  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const title = cardElement.querySelector('.card__title');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  title.textContent = data.name;
  likeCount.textContent = data.likes.length;

  const isLikedByUser = data.likes.some((user) => user._id === currentUserId);
if (isLikedByUser) {
  likeButton.classList.add('card__like-button_is-active');
}


  // Удаление кнопки
  if (data.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  // Обработчик лайка
  likeButton.addEventListener('click', () => {
    handleLikeClick(
      likeButton,
      data._id,
      likeCount,
      likeButton.classList.contains('card__like-button_is-active'),
      onLikeToggle
    );
  });

  // Обработчик удаления
  deleteButton.addEventListener('click', () => {
    handleDeleteCard(cardElement);
  });

  // Открытие изображения
  cardImage.addEventListener('click', () => {
    handleImageClick(data);
  });

  return cardElement;
}

export function handleDeleteCard(cardElement) {
  const cardId = cardElement.dataset.cardId;

  deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err);
    });
}

export function handleLikeClick(
  likeButton,
  cardId,
  likeCountElement,
  isLiked,
  onLikeToggle
) {
  onLikeToggle(cardId, isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCountElement.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.error('Ошибка при изменении лайка:', err);
    });
}
