
// Функция для открытия окна
export function openPopup(popup) {  
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closePopupByEsc);
  popup.classList.add('popup_is-animated');
}

// Функция для закрытия окна
export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closePopupByEsc);
}

// Функция для закрытия окна по клику на оверлей
function closePopupByOverlay(event) {
  const popup = event.target.closest('.popup');
  if (popup && event.target === popup) {
    closePopup(popup);
  }
}

// Функция для закрытия окна по нажатию Esc
function closePopupByEsc(event) {
  if (event.key === 'Escape') {
    const popup = document.querySelector('.popup_is-opened');
    if (popup) {
      closePopup(popup);
    }
  }
}

// закрытие
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

// оверлей
export function setupOverlayListeners() {
  document.addEventListener('click', (event) => {
    closePopupByOverlay(event);
  });
}

// Функция для открытия попапа редактирования профиля
export function openEditProfilePopup(profileTitleElement, profileDescriptionElement) {
  const editProfilePopup = document.querySelector('.popup_type_edit');
  const nameInput = editProfilePopup.querySelector('.popup__input_type_name');
  const descriptionInput = editProfilePopup.querySelector('.popup__input_type_description');

  nameInput.value = profileTitleElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;

  openPopup(editProfilePopup);
}