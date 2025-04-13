
// Функция для открытия модального окна
export function openPopup(popup) {
  popup.classList.add('popup_opened');
  document.addEventListener('keydown', closePopupByEsc);
}

// Функция для закрытия модального окна
export function closePopup(popup) {
  popup.classList.remove('popup_opened');
  document.removeEventListener('keydown', closePopupByEsc);
}

// Функция для закрытия модального окна по клику на оверлей
function closePopupByOverlay(event) {
  const popup = event.target.closest('.popup');
  if (popup && event.target === popup) {
    closePopup(popup);
  }
}

// Функция для закрытия модального окна по нажатию клавиши Esc
function closePopupByEsc(event) {
  if (event.key === 'Escape') {
    const popup = document.querySelector('.popup_opened');
    if (popup) {
      closePopup(popup);
    }
  }
}

// Функция для установки обработчиков событий на кнопки закрытия
export function setupCloseButtons() {
  const closeButtons = document.querySelectorAll('.popup__close');
  closeButtons.forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
      const popup = closeButton.closest('.popup');
      if (popup) {
        closePopup(popup);
      }
    });
  });
}

// Функция для установки обработчиков событий на оверлей
export function setupOverlayListeners() {
  document.addEventListener('click', (event) => {
    closePopupByOverlay(event);
  });
}

// Функция для открытия попапа редактирования профиля
export function openEditProfilePopup(profileTitleElement, profileDescriptionElement) {
  const editProfilePopup = document.querySelector('.popup_type_edit');
  const nameInput = editProfilePopup.querySelector('.popup__input.popup__input_type_name');
  const descriptionInput = editProfilePopup.querySelector('.popup__input.popup__input_type_description');

  // Устанавливаем начальные значения полей
  nameInput.value = profileTitleElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;

  openPopup(editProfilePopup);
}