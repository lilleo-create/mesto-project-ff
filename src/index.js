
// Обработчик сабмита
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './pages/index.css';
import { createCard, handleDeleteCard, handleLikeClick } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import logoPath from './images/logo.svg';
import { enableValidation, clearValidation } from './components/validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, likeCard, unlikeCard, updateUserAvatar } from './components/api.js';






// DOM-элементы
const placesList = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const avatarImage = document.querySelector('.profile__image');
const avatarEditButton = document.querySelector('.profile__image-edit');
const avatarForm = document.querySelector('[name="avatar-form"]');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar');
const popupAvatar = document.querySelector('.popup_type_avatar');


const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popups = document.querySelectorAll('.popup');
const popupImageEl = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');
const editProfileForm = popupEdit.querySelector('.popup__form');
const newCardForm = popupNewCard.querySelector('.popup__form');

const nameInput = popupEdit.querySelector('.popup__input_type_name');
const jobInput = popupEdit.querySelector('.popup__input_type_description');



const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const placeNameInput = popupNewCard.querySelector('.popup__input_type_card-name');
const placeLinkInput = popupNewCard.querySelector('.popup__input_type_url');


document.querySelector('.header__logo').src = logoPath;

let userId;

function handleLikeToggle(cardId, isLiked) {
  return isLiked ? unlikeCard(cardId) : likeCard(cardId);
}

function wrappedLikeClick(likeBtn, cardId, likeCounter, isLiked) {
  return handleLikeClick(likeBtn, cardId, likeCounter, isLiked, handleLikeToggle);
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    // Запоминаем ID пользователя
    userId = userData._id;

    // Отображаем имя, описание и аватар
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarImage.style.backgroundImage = `url(${userData.avatar})`;

    // Рендерим карточки 
    cards.forEach(cardData => {
      const cardElement = createCard(
        cardData,
        handleDeleteCard,
        wrappedLikeClick,
        openImagePopup,
        userId
      );
        placesList.append(cardElement);
    });


  })
  .catch((err) => {
    console.error('Ошибка при загрузке данных с сервера:', err);
  });


const config = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};



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
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err);
    });
}


//Данные из профиля в импуты
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });
  openModal(popupEdit);
});


function handleAvatarSubmit(evt) {
  evt.preventDefault();
  updateUserAvatar(avatarInput.value)
    .then((res) => {
      avatarImage.style.backgroundImage = `url(${res.avatar})`;
      closeModal(popupAvatar);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err);
    });
}
avatarEditButton.addEventListener('click', () => {
  clearValidation(avatarForm, config);
  openModal(popupAvatar);
});

avatarForm.addEventListener('submit', handleAvatarSubmit);



//Обработчик добавления карточки
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
        userId
      );


      placesList.prepend(newCard);
      newCardForm.reset();
      clearValidation(newCardForm, {
        formSelector: '.popup__form',
        inputSelector: '.popup__input',
        submitButtonSelector: '.popup__button',
        inactiveButtonClass: 'popup__button_disabled',
        inputErrorClass: 'popup__input_type_error',
        errorClass: 'popup__error_visible'
      });
      closeModal(popupNewCard);
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err);
    });
}
editProfileForm.addEventListener('submit', handleProfileSubmit);


newCardForm.addEventListener('submit', handleNewCardSubmit);


