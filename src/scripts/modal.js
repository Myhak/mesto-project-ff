
// Функция для открытия окна
export function openPopup(popup) {
  popup.classList.add('popup_is-opened');

  const form = popup.querySelector('.popup__form');
  if (form) {
    const saveButton = form.querySelector('.popup__button');
    if (saveButton) {
      saveButton.disabled = true; 
    }
  }

  document.addEventListener('keydown', closePopupByEsc);
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
