import '../pages/index.css';

// === Импорты из других модулей ===
import {
  getUserInfo,
  getInitialCards,
  editProfile as apiEditProfile,
  addCard as apiAddCard,
  updateAvatar as apiUpdateAvatar,
  deleteCard as apiDeleteCard
} from './api.js';
import {
  createCard,
  handleLikeClick
} from './card.js';
import {
  openPopup,
  closePopup,
  setupCloseButtons,
  setupOverlayListeners
} from './modal.js';
import {
  enableValidation,
  clearValidation,
  toggleButtonState
} from './validation.js';

// === Конфигурация валидации ===
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);

// === Элементы профиля ===
const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const profileAvatarElement = document.querySelector('.profile__image');

// Контейнер аватара и попап
const profileAvatarContainer = document.querySelector('.profile__avatar-container');
const avatarPopup = document.querySelector('.popup_type_avatar-popup');

// === Кнопки управления ===
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');

// === Модальные окна ===
const editProfilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// === Формы модальных окон ===
const editProfileForm = editProfilePopup?.querySelector('.popup__form[name="edit-profile"]');
const newCardForm = newCardPopup?.querySelector('.popup__form[name="new-place"]');
const avatarForm = avatarPopup?.querySelector('.popup__form[name="avatar-form"]');

// === Элементы формы редактирования профиля ===
const nameInput = editProfileForm?.querySelector('.popup__input_type_name');
const descriptionInput = editProfileForm?.querySelector('.popup__input_type_description');

// === Элементы формы добавления новой карточки ===
const cardNameInput = newCardForm?.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardForm?.querySelector('.popup__input_type_url');

// === Элементы формы обновления аватара ===
const avatarInput = avatarForm?.querySelector('.popup__input_type_avatar-url');

// === Элементы попапа просмотра изображения ===
const popupImageElement = imagePopup?.querySelector('.popup__image');
const popupCaptionElement = imagePopup?.querySelector('.popup__caption');

// === Список карточек ===
const placesList = document.querySelector('.places__list');

// === Текущий пользователь (глобальная переменная) ===
let currentUser = null;

export function setCurrentUser(user) {
  currentUser = user;
}

// === Установка слушателей событий для закрытия попапов ===
setupCloseButtons();
setupOverlayListeners();

// === Загрузка данных с сервера и отрисовка интерфейса ===
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    setCurrentUser(userData);
    if (profileTitleElement && profileDescriptionElement && profileAvatarElement) {
      profileTitleElement.textContent = userData.name;
      profileDescriptionElement.textContent = userData.about;
      profileAvatarElement.src = userData.avatar;
    } else {
      console.error('Не найдены элементы профиля в DOM');
    }

    placesList.innerHTML = '';
    cards.forEach((cardData) => {
      const card = createCard(
        cardData,
        {
          handleLikeClick,
          deleteCard: (cardId) => {
            return apiDeleteCard(cardId); // просто вызываем API, удаление из DOM происходит в card.js
          },
          handleImageClick
        },
        userData._id
      );
      placesList.append(card);
    });
  })
  .catch((err) => {
    console.error('Ошибка при загрузке данных с сервера:', err);
  });

// === Слушатели событий кнопок ===
if (editProfileButton) {
  editProfileButton.addEventListener('click', () => {
    openEditProfilePopup();
  });
}

if (addCardButton) {
  addCardButton.addEventListener('click', () => {
    openPopup(newCardPopup);
    clearValidation(newCardForm, validationConfig);
    updateNewCardFormValidation();
  });
}

if (profileAvatarContainer && avatarPopup) {
  profileAvatarContainer.addEventListener('click', () => {
    openPopup(avatarPopup);
    clearValidation(avatarForm, validationConfig);
    updateAvatarFormValidation();
  });
} else {
  console.error('profile__avatar-container или popup_type_avatar-popup не найдены');
}

// === Обработчики форм ===
if (editProfileForm) {
  editProfileForm.addEventListener('submit', handleEditProfileSubmit);
}

if (newCardForm) {
  newCardForm.addEventListener('submit', handleNewCardSubmit);
}

if (avatarForm) {
  avatarForm.addEventListener('submit', handleAvatarUpdateSubmit);
}

// === Редактирование профиля ===
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const saveButton = editProfileForm.querySelector('.popup__button');
  const originalButtonText = saveButton.textContent;
  saveButton.textContent = 'Сохранение...';
  saveButton.disabled = true;
  saveButton.classList.add('loading');

  const newName = nameInput.value.trim();
  const newDescription = descriptionInput.value.trim();

  apiEditProfile(newName, newDescription)
    .then((updatedUser) => {
      profileTitleElement.textContent = updatedUser.name;
      profileDescriptionElement.textContent = updatedUser.about;
      closePopup(editProfilePopup);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
      saveButton.textContent = originalButtonText;
      saveButton.disabled = false;
      saveButton.classList.remove('loading');
    });
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const saveButton = newCardForm.querySelector('.popup__button');
  const originalButtonText = saveButton.textContent;
  saveButton.textContent = 'Сохранение...';
  saveButton.disabled = true;
  saveButton.classList.add('loading');

  const newName = cardNameInput.value.trim();
  const newLink = cardLinkInput.value.trim();

  apiAddCard(newName, newLink)
    .then((newCardData) => {
      const newCard = createCard(
        newCardData,
        {
          handleLikeClick,
          deleteCard: (cardId) => {
            return apiDeleteCard(cardId); // передаём дальше
          },
          handleImageClick
        },
        currentUser._id
      );

      placesList.prepend(newCard);
      newCardForm.reset();
      clearValidation(newCardForm, validationConfig);
      closePopup(newCardPopup);
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      saveButton.textContent = originalButtonText;
      saveButton.disabled = false;
      saveButton.classList.remove('loading');
    });
}

// === Обновление аватара ===
function handleAvatarUpdateSubmit(evt) {
  evt.preventDefault();
  const saveButton = avatarForm.querySelector('.popup__button');
  const originalButtonText = saveButton.textContent;
  saveButton.textContent = 'Сохранение...';
  saveButton.disabled = true;
  saveButton.classList.add('loading');

  const newAvatarUrl = avatarInput.value.trim();

  apiUpdateAvatar(newAvatarUrl)
    .then((updatedUser) => {
      profileAvatarElement.src = updatedUser.avatar;
      closePopup(avatarPopup);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      saveButton.textContent = originalButtonText;
      saveButton.disabled = false;
      saveButton.classList.remove('loading');
    });
}

// === Открытие попапа редактирования профиля ===
export function openEditProfilePopup() {
  if (!nameInput || !descriptionInput) {
    console.error('openEditProfilePopup: поля ввода не найдены');
    return;
  }
  nameInput.value = profileTitleElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;

  if (editProfileForm && validationConfig) {
    clearValidation(editProfileForm, validationConfig);
    updateEditProfileFormValidation();
  } else {
    console.error('openEditProfilePopup: форма или конфигурация не найдены');
  }

  openPopup(editProfilePopup);
}

// === Обновление состояния кнопок в формах ===
function updateEditProfileFormValidation() {
  const inputList = Array.from(editProfileForm.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = editProfileForm.querySelector(validationConfig.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, validationConfig);
}

function updateNewCardFormValidation() {
  const inputList = Array.from(newCardForm.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = newCardForm.querySelector(validationConfig.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, validationConfig);
}

function updateAvatarFormValidation() {
  const inputList = Array.from(avatarForm.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = avatarForm.querySelector(validationConfig.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, validationConfig);
}

// === Обработчик клика по изображению для открытия попапа ===
function handleImageClick(imageLink, imageName) {
  if (popupImageElement && popupCaptionElement) {
    popupImageElement.src = imageLink;
    popupImageElement.alt = imageName;
    popupCaptionElement.textContent = imageName;
    openPopup(imagePopup);
  } else {
    console.error('handleImageClick: элементы попапа не найдены');
  }
}