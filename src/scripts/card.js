import { addLike, removeLike, deleteCard as apiDeleteCard } from './api.js';

export function createCard(cardData, { handleLikeClick, deleteCard, handleImageClick }, userId) {
  const cardTemplate = document.querySelector('#card-template');
  if (!cardTemplate) {
    console.error('Шаблон карточки не найден');
    return null;
  }

  const cardElement = cardTemplate.content.cloneNode(true).querySelector('.places__item');
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Добавляем data-атрибут для отладки и поиска
  cardElement.setAttribute('data-card-id', cardData._id);

  // Заполняем данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Проверяем, лайкнул ли пользователь карточку
  const isLiked = cardData.likes.some(like => like._id === userId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Проверяем, является ли пользователь владельцем карточки
  const isOwnedByCurrentUser = cardData.owner._id === userId;
  if (!isOwnedByCurrentUser) {
    deleteButton.style.display = 'none';
  }

  // Обработчики событий

  // Лайк
  likeButton.addEventListener('click', () => {
    handleLikeClick(likeButton, likeCount, cardData._id);
  });

  // Удаление
  deleteButton.addEventListener('click', () => {
    deleteCard(cardData._id)
      .then(() => {
        cardElement.remove(); // Удаляем карточку из DOM
      })
      .catch((err) => {
        console.error('Ошибка при удалении карточки:', err);
      });
  });

  // Клик по изображению
  cardImage.addEventListener('click', () => {
    handleImageClick(cardImage.src, cardData.name);
  });

  return cardElement;
}

export function handleLikeClick(likeButton, likeCount, cardId) {
  const isCurrentlyLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isCurrentlyLiked) {
    removeLike(cardId)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.remove('card__like-button_is-active');
      })
      .catch((err) => {
        console.error('Ошибка при удалении лайка:', err);
      });
  } else {
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