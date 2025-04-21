import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, handleLikeClick } from './card.js';
import { openPopup, closePopup, setupCloseButtons, setupOverlayListeners } from './modal.js';

// Элементы профиля
const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');

// Кнопки управления
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');

// Модальные окна
const editProfilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Формы модальных окон
const editProfileForm = editProfilePopup?.querySelector('.popup__form[name="edit-profile"]');
const newCardForm = newCardPopup?.querySelector('.popup__form[name="new-place"]');

// Элементы формы редактирования профиля
const nameInput = editProfileForm?.querySelector('.popup__input_type_name');
const descriptionInput = editProfileForm?.querySelector('.popup__input_type_description');

// Элементы формы добавления новой карточки
const cardNameInput = newCardForm?.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardForm?.querySelector('.popup__input_type_url');

// Элементы модального окна просмотра изображения
const popupImageElement = imagePopup?.querySelector('.popup__image');
const popupCaptionElement = imagePopup?.querySelector('.popup__caption');

// Список карточек
const placesList = document.querySelector('.places__list');

// Рендер начальных карточек
function renderInitialCards() {
  if (initialCards) {
    initialCards.forEach((cardData) => {
      const card = createCard(cardData, { deleteCard, handleLikeClick, handleImageClick });
      placesList.append(card);
    });
  } else {
    console.error('Массив initialCards не найден!');
  }
}

// Обработчик события для кнопки редактирования профиля
editProfileButton.addEventListener('click', () => {
  openEditProfilePopup();
});

// Обработчик события для кнопки добавления нового места
addCardButton.addEventListener('click', () => {
  openPopup(newCardPopup);
});

setupCloseButtons();
setupOverlayListeners();

renderInitialCards();

// Обработчик формы редактирования профиля
if (editProfileForm) {
  editProfileForm.addEventListener('submit', handleEditProfileSubmit);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const newName = nameInput.value.trim();
  const newDescription = descriptionInput.value.trim();

  profileTitleElement.textContent = newName;
  profileDescriptionElement.textContent = newDescription;

  closePopup(editProfilePopup);
}

// Обработчик формы добавления карточки
if (newCardForm) {
  newCardForm.addEventListener('submit', handleNewCardSubmit);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();

  const newName = cardNameInput.value.trim();
  const newLink = cardLinkInput.value.trim();

  const newCardData = {
    name: newName,
    link: newLink
  };

  const newCard = createCard(newCardData, { deleteCard, handleLikeClick, handleImageClick });
  placesList.prepend(newCard);

  cardNameInput.value = '';
  cardLinkInput.value = '';

  closePopup(newCardPopup);
}

// Функция для обработки клика на изображении карточки
function handleImageClick(imageLink, imageName) {
  popupImageElement.src = imageLink;
  popupImageElement.alt = imageName;
  popupCaptionElement.textContent = imageName;

  openPopup(imagePopup);
}

// Функция для открытия попапа редактирования профиля
export function openEditProfilePopup() {
  nameInput.value = profileTitleElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;

  openPopup(editProfilePopup);
}