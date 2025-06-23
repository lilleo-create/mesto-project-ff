// index.js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './pages/index.css';
import logoPath from './images/logo.svg';
import { createCard, handleDeleteCard, handleLikeClick } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addCard,
  likeCard,
  unlikeCard,
  updateUserAvatar,
  deleteCardFromServer
} from './components/api.js';

// DOM
const placesList = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__image-edit');
const avatarImage = document.querySelector('.profile__image');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupAvatar = document.querySelector('.popup_type_avatar');
const popupImage = document.querySelector('.popup_type_image');
const popupConfirm = document.querySelector('.popup_type_confirm');
const confirmForm = popupConfirm.querySelector('.popup__form');

const editProfileForm = popupEdit.querySelector('.popup__form');
const newCardForm = popupNewCard.querySelector('.popup__form');
const avatarForm = popupAvatar.querySelector('.popup__form');

const nameInput = popupEdit.querySelector('.popup__input_type_name');
const jobInput = popupEdit.querySelector('.popup__input_type_description');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar');
const placeNameInput = popupNewCard.querySelector('.popup__input_type_card-name');
const placeLinkInput = popupNewCard.querySelector('.popup__input_type_url');

const popupImageEl = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

document.querySelector('.header__logo').src = logoPath;

let userId;
let confirmCallback = null;

function openConfirmPopup(callback) {
  confirmCallback = callback;
  openModal(popupConfirm);
}

confirmForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (confirmCallback) {
    confirmCallback();
    closeModal(popupConfirm);
    confirmCallback = null;
  }
});

function handleLikeToggle(cardId, isLiked) {
  return isLiked ? unlikeCard(cardId) : likeCard(cardId);
}

function wrappedLikeClick(likeBtn, cardId, likeCounter, isLiked) {
  return handleLikeClick(likeBtn, cardId, likeCounter, isLiked, handleLikeToggle);
}

function openImagePopup({ name, link }) {
  popupImageEl.src = link;
  popupImageEl.alt = name;
  popupCaption.textContent = name;
  openModal(popupImage);
}

function handleProfileSubmit(evt) {
  evt.preventDefault();
  const userData = {
    name: nameInput.value,
    about: jobInput.value
  };
  updateUserInfo(userData)
    .then((updatedUser) => {
      profileTitle.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeModal(popupEdit);
    })
    .catch((err) => console.error('Ошибка при обновлении профиля:', err));
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  updateUserAvatar(avatarInput.value)
    .then((res) => {
      avatarImage.style.backgroundImage = `url(${res.avatar})`;
      closeModal(popupAvatar);
      avatarForm.reset();
    })
    .catch((err) => console.error('Ошибка при обновлении аватара:', err));
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value
  };
  addCard(newCardData)
    .then((cardFromServer) => {
      const newCard = createCard(
        cardFromServer,
        handleDeleteCard,
        wrappedLikeClick,
        openImagePopup,
        userId,
        handleLikeToggle,
        openConfirmPopup
      );
      placesList.prepend(newCard);
      newCardForm.reset();
      clearValidation(newCardForm, config);
      closeModal(popupNewCard);
    })
    .catch((err) => console.error('Ошибка при добавлении карточки:', err));
}

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, config);
  openModal(popupEdit);
});

profileAddButton.addEventListener('click', () => {
  newCardForm.reset();
  clearValidation(newCardForm, config);
  openModal(popupNewCard);
});

avatarEditButton.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, config);
  openModal(popupAvatar);
});

const config = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(config);

editProfileForm.addEventListener('submit', handleProfileSubmit);
avatarForm.addEventListener('submit', handleAvatarSubmit);
newCardForm.addEventListener('submit', handleNewCardSubmit);

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarImage.style.backgroundImage = `url(${userData.avatar})`;
    cards.reverse().forEach(cardData => {
      const cardElement = createCard(
        cardData,
        handleDeleteCard,
        wrappedLikeClick,
        openImagePopup,
        userId,
        handleLikeToggle,
        openConfirmPopup
      );
      placesList.append(cardElement);
    });
  })
  .catch(err => console.error('Ошибка при инициализации данных:', err));
