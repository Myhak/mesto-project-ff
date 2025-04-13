
import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, handleLikeClick } from './card.js';
import { openPopup, closePopup, setupCloseButtons, setupOverlayListeners, openEditProfilePopup } from './modal.js';

// Получаем элементы профиля
const profileTitleElement = document.querySelector('.profile__title'); // Имя пользователя
const profileDescriptionElement = document.querySelector('.profile__description'); // Описание профиля

// Получаем кнопку редактирования профиля
const editProfileButton = document.querySelector('.profile__edit-button');

// Получаем кнопку добавления нового места
const addCardButton = document.querySelector('.profile__add-button');

// Получаем элементы модальных окон
const editProfilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Получаем список карточек
const placesList = document.querySelector('.places__list');

// Функция для рендера начальных карточек
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
  openEditProfilePopup(profileTitleElement, profileDescriptionElement);
});

// Обработчик события для кнопки добавления нового места
addCardButton.addEventListener('click', () => {
  openPopup(newCardPopup);
});

// Настройка обработчиков событий для закрытия модальных окон
setupCloseButtons();
setupOverlayListeners();

// Рендер начальных карточек
renderInitialCards();

// Обработчик формы редактирования профиля
const editProfileForm = document.querySelector('.popup__form[name="edit-profile"]');
if (editProfileForm) {
  editProfileForm.addEventListener('submit', handleEditProfileSubmit);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы

  // Получаем значения из полей формы
  const nameInput = editProfileForm.querySelector('.popup__input.popup__input_type_name');
  const descriptionInput = editProfileForm.querySelector('.popup__input.popup__input_type_description');

  const newName = nameInput.value.trim();
  const newDescription = descriptionInput.value.trim();

  // Обновляем соответствующие элементы на странице
  profileTitleElement.textContent = newName;
  profileDescriptionElement.textContent = newDescription;

  // Закрываем попап
  closePopup(editProfilePopup);
}

// Обработчик формы добавления карточки
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
if (newCardForm) {
  newCardForm.addEventListener('submit', handleNewCardSubmit);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы

  // Получаем значения из полей формы
  const nameInput = newCardForm.querySelector('.popup__input.popup__input_type_card-name');
  const linkInput = newCardForm.querySelector('.popup__input.popup__input_type_url');

  const newName = nameInput.value.trim();
  const newLink = linkInput.value.trim();

  // Создаем новую карточку
  const newCardData = {
    name: newName,
    link: newLink
  };

  const newCard = createCard(newCardData, { deleteCard, handleLikeClick, handleImageClick });
  placesList.prepend(newCard); // Добавляем новую карточку в начало списка

  // Очищаем поля формы
  nameInput.value = '';
  linkInput.value = '';

  // Закрываем попап
  closePopup(newCardPopup);
}

// Функция для обработки клика на изображении карточки
function handleImageClick(imageLink, imageName) {
  const imagePopup = document.querySelector('.popup_type_image');
  const popupImage = imagePopup.querySelector('.popup__image');
  const popupCaption = imagePopup.querySelector('.popup__caption');

  popupImage.src = imageLink;
  popupImage.alt = imageName;
  popupCaption.textContent = imageName;

  openPopup(imagePopup);
}