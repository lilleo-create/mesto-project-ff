// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

const placesList = document.querySelector('.places__list');



// @todo: DOM узлы
// Пока не используются


// @todo: Функция создания карточки

function createCard (cardData, handleDelete) {
  const cardElement = cardTemplate.cloneNode(true).querySelector('.card')

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => handleDelete(cardElement))

  return cardElement;
}

// @todo: Функция удаления карточки

function handleDeleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу

initialCards.forEach((cardData) => {
  const card = createCard(cardData, handleDeleteCard);
  placesList.appendChild(card);
});
