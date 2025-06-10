import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, handleDeleteCard, handleLikeClick } from './components/card.js';
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
const popupImageEl = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');
const editProfileForm = popupEdit.querySelector('.popup__form');
const nameInput = popupEdit.querySelector('.popup__input_type_name');
const jobInput = popupEdit.querySelector('.popup__input_type_description');


const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const newCardForm = popupNewCard.querySelector('.popup__form');
const placeNameInput = popupNewCard.querySelector('.popup__input_type_card-name');
const placeLinkInput = popupNewCard.querySelector('.popup__input_type_url');


document.querySelector('.header__logo').src = logoPath;
document.querySelector('.profile__image').style.backgroundImage = `url(${avatarPath})`;


initialCards.forEach((cardData) => {
  const card = createCard(cardData, handleDeleteCard, handleLikeClick, openImagePopup);
  placesList.appendChild(card);
});


// Закрытие попапов по клику на оверлей или крестику
popups.forEach(popup => {
  popup.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close')) {
      closeModal(popup);
    }
  });
});


// Обработчики открытия попапов
profileAddButton.addEventListener('click', () => openModal(popupNewCard));


// Функция открытия попапа с изображением
function openImagePopup({ name, link }) {
  popupImageEl.src = link;
  popupImageEl.alt = name;
  popupCaption.textContent = name;
  openModal(popupImage);
}


// Обработчик сабмита
function handleProfileSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupEdit);
}
editProfileForm.addEventListener('submit', handleProfileSubmit);


//Данные из профиля в импуты
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  openModal(popupEdit);
});


//Обработчик добавления карточки
function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value
  };

  const newCard = createCard(newCardData, handleDeleteCard, handleLikeClick, openImagePopup);
  placesList.prepend(newCard);
  newCardForm.reset();
  closeModal(popupNewCard);
}
newCardForm.addEventListener('submit', handleNewCardSubmit);






