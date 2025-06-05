import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, handleDeleteCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import logoPath from './images/logo.svg';
import avatarPath from './images/avatar.jpg';



// DOM-элементы
const placesList = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popups = document.querySelectorAll('.popup');
const formElement = popupEdit.querySelector('.popup__form');
const nameInput = popupEdit.querySelector('.popup__input_type_name');
const jobInput = popupEdit.querySelector('.popup__input_type_description');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const newCardForm = popupNewCard.querySelector('.popup__form');
const placeNameInput = popupNewCard.querySelector('.popup__input_type_card-name');
const placeLinkInput = popupNewCard.querySelector('.popup__input_type_url');


const logo = document.querySelector('.header__logo').src = logoPath;
const profileImage = document.querySelector('.profile__image').style.backgroundImage = `url(${avatarPath})`;

// Закрытие попапов по клику на оверлей или крестику
popups.forEach(popup => {
  popup.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close')) {
      closeModal(popup);
    }
  });
});

// Обработчики открытия попапов
profileEditButton.addEventListener('click', () => openModal(popupEdit));
profileAddButton.addEventListener('click', () => openModal(popupNewCard));

// Функция открытия попапа с изображением
function openImagePopup({ name, link }) {
  const popupImageEl = popupImage.querySelector('.popup__image');
  const popupCaption = popupImage.querySelector('.popup__caption');
  popupImageEl.src = link;
  popupImageEl.alt = name;
  popupCaption.textContent = name;
  openModal(popupImage);
}

// Обработчик сабмита
function handleFormSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupEdit);
}
formElement.addEventListener('submit', handleFormSubmit);


//Обработчик добавления карточки
function handleNewCardSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value
  };

  const newCard = createCard(newCardData, handleDeleteCard, null, openImagePopup);
  placesList.prepend(newCard);
  newCardForm.reset();
  closeModal(popupNewCard);
}
newCardForm.addEventListener('submit', handleNewCardSubmit);

//обработчик лайка
function handleLikeClick(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}
initialCards.forEach((cardData) => {
  const card = createCard(cardData, handleDeleteCard, handleLikeClick, openImagePopup);
  placesList.appendChild(card);
});




