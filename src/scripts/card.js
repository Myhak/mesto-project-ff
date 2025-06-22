import { addLike, removeLike } from './api.js';

// Глобальные переменные
let currentUser = null;

//Установка текущего пользователя
export function setCurrentUser(user) {
  currentUser = user;
}

// Функция для создания карточки
export function createCard(cardData, { deleteCard, handleImageClick }) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.cloneNode(true).querySelector('.places__item');

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Заполнение данных карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Отображение количества лайков
  likeCount.textContent = cardData.likes.length;

  // Проверяем, лайкнул ли пользователь эту карточку
  const isLiked = cardData.likes.some(like => like._id === currentUser._id);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Проверяем, является ли текущий пользователь владельцем карточки
  const isOwnedByCurrentUser = cardData.owner._id === currentUser._id;
  if (!isOwnedByCurrentUser) {
    deleteButton.style.display = 'none';
  }

  // Обработчики событий

  // Клик по кнопке удаления
  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement, cardData._id);
  });

  // Клик по кнопке лайка
  likeButton.addEventListener('click', () => {
    handleLikeClick(cardElement, cardData._id, isLiked);
  });

  // Клик по изображению карточки
  cardImage.addEventListener('click', () => {
    handleImageClick(cardImage.src, cardData.name);
  });

  return cardElement;
}

// Функция для обработки клика на кнопку лайка
export function handleLikeClick(cardElement, cardId, isLiked) {
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  if (isLiked) {
    // Убираем лайк
    removeLike(cardId)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.remove('card__like-button_is-active');
      })
      .catch((err) => {
        console.error('Ошибка при удалении лайка:', err);
      });
  } else {
    // Ставим лайк
    addLike(cardId)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.add('card__like-button_is-active');
      })
      .catch((err) => {
        console.error('Ошибка при добавлении лайка:', err);
      });
  }
}

// Функция для удаления карточки
export function deleteCard(cardElement, cardId) {
  fetch(`https://nomoreparties.co/v1/wff-cohort-41/cards/${cardId}`,  {
    method: 'DELETE',
    headers: {
      authorization: '5c54faa6-cab3-4ff0-8168-4c278232587a',
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json();
    })
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err);
    });
}