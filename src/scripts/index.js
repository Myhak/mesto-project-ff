
import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, handleLikeClick } from './card.js';
import { openPopup, closePopup, setupCloseButtons, setupOverlayListeners, openEditProfilePopup } from './modal.js';

// элементы профиля
const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');

// кнопкa редактирования профиля
const editProfileButton = document.querySelector('.profile__edit-button');

// кнопкa добавления нового места
const addCardButton = document.querySelector('.profile__add-button');

const editProfilePopup = document.querySelector('.profile__info');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup__image');

const placesList = document.querySelector('.places__list');

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

setupCloseButtons();
setupOverlayListeners();

renderInitialCards();

// Обработчик формы редактирования профиля
const editProfileForm = document.querySelector('.popup__form[name="edit-profile"]');
if (editProfileForm) {
  editProfileForm.addEventListener('submit', handleEditProfileSubmit);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const nameInput = editProfileForm.querySelector('.popup__input_type_name');
  const descriptionInput = editProfileForm.querySelector('.popup__input_type_description');

  const newName = nameInput.value.trim();
  const newDescription = descriptionInput.value.trim();

  profileTitleElement.textContent = newName;
  profileDescriptionElement.textContent = newDescription;

  closePopup(editProfilePopup);
}

// Обработчик формы добавления карточки
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
if (newCardForm) {
  newCardForm.addEventListener('submit', handleNewCardSubmit);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();

  const nameInput = newCardForm.querySelector('.popup__input_type_card-name');
  const linkInput = newCardForm.querySelector('.popup__input_type_url');

  const newName = nameInput.value.trim();
  const newLink = linkInput.value.trim();

  const newCardData = {
    name: newName,
    link: newLink
  };

  const newCard = createCard(newCardData, { deleteCard, handleLikeClick, handleImageClick });
  placesList.prepend(newCard);

  nameInput.value = '';
  linkInput.value = '';

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