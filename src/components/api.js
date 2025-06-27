const token = 'a0a1c567-9f15-42c0-a0ed-135bc1d255d6';
const cohortId = 'wff-cohort-41';
const baseUrl = `https://nomoreparties.co/v1/${cohortId}`;

const headers = {
  authorization: token,
  'Content-Type': 'application/json'
};

const handleResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

// Получение данных пользователя
export function getUserInfo() {
  return fetch(`${baseUrl}/users/me`, {
    method: 'GET',
    headers: headers
  }).then(handleResponse);
};

// Получение стартовых карточек
export function getInitialCards() {
  return fetch(`${baseUrl}/cards`, {
    method: 'GET',
    headers: headers
  }).then(handleResponse);
};

export function addCard(data) {
  return fetch(`${baseUrl}/cards`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      name: data.name,
      link: data.link
    })
  }).then(handleResponse);
};

export function updateUserInfo({ name, about }) {
  return fetch(`${baseUrl}/users/me`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({ name, about })
  }).then(handleResponse);
}

export function deleteCardFromServer(cardId) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: headers
  }).then(handleResponse);
}

export function likeCard(cardId) {
  return fetch(`${baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers
  }).then(handleResponse);
}

export function unlikeCard(cardId) {
  return fetch(`${baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers
  }).then(handleResponse);
}

export function updateUserAvatar(avatarUrl) {
  return fetch(`${baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(handleResponse);
}

