import { addLike, removeLike } from './api.js';

// Функция для создания карточки
export function createCard(cardData, { handleLikeClick, deleteCard, handleImageClick }, userId) {
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

  // Проверяем, лайкнул ли текущий пользователь эту карточку
  const isLiked = cardData.likes.some(like => like._id === userId);

  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Проверяем, является ли текущий пользователь владельцем карточки
  const isOwnedByCurrentUser = cardData.owner._id === userId;

  if (!isOwnedByCurrentUser) {
    deleteButton.style.display = 'none';
  }

  // Обработчики событий

  // Клик по кнопке лайка
  likeButton.addEventListener('click', () => {
    handleLikeClick(cardElement, cardData._id, cardData, userId);
  });

  // Клик по кнопке удаления
  deleteButton.addEventListener('click', () => {
    deleteCard(cardData._id);
  });

  // Клик по изображению карточки
  cardImage.addEventListener('click', () => {
    handleImageClick(cardImage.src, cardData.name);
  });

  return cardElement;
}

// Экспортируем функцию, которая вызывается при клике на кнопку лайка
export function handleLikeClick(cardElement, cardId, cardData, userId) {
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  const isCurrentlyLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isCurrentlyLiked) {
    removeLike(cardId)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.remove('card__like-button_is-active');
        cardData.likes = updatedCard.likes; // Обновляем массив likes
      })
      .catch((err) => {
        console.error('Ошибка при удалении лайка:', err);
      });
  } else {
    addLike(cardId)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.add('card__like-button_is-active');
        cardData.likes = updatedCard.likes; // Обновляем массив likes
      })
      .catch((err) => {
        console.error('Ошибка при добавлении лайка:', err);
      });
  }
}