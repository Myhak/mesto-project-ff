
// Функция для создания карточки
export function createCard(item, { deleteCard, handleLikeClick, handleImageClick }) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.cloneNode(true).querySelector('.places__item');

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;

  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement);
  });

  likeButton.addEventListener('click', () => {
    handleLikeClick(likeButton);
  });

  // Обработчик для открытия попапа с изображением
  cardImage.addEventListener('click', () => {
    handleImageClick(item.link, item.name);
  });

  return cardElement;
}

// Функция для удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove();
}

// Функция для лайка карточки
export function handleLikeClick(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}