// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const cardTemplate = document.querySelector('#card-template');

const placesList = document.querySelector('.places__list');

function deleteCard(cardElement) {
  cardElement.remove();
}

function createCard(item, { deleteCard }) {
  const cardElement = cardTemplate.content.cloneNode(true).querySelector('.places__item');

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;

  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement);
  });

  return cardElement;
}

function renderInitialCards() {
  if (initialCards) {
    initialCards.forEach((cardData) => {
      const card = createCard(cardData, { deleteCard });

      placesList.append(card);
    });
  } else {
    console.error('Массив initialCards не найден!');
  }
}

renderInitialCards();