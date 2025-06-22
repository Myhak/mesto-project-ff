
const validCharsRegex = /^[a-zA-Zа-яА-ЯёЁ -]+$/;
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i;

export function enableValidation(config) {
  const formList = document.querySelectorAll(config.formSelector);

  formList.forEach((formElement) => {
    const inputList = formElement.querySelectorAll(config.inputSelector);
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    // Устанавливаем начальное состояние кнопки
    toggleButtonState(inputList, buttonElement, config);

    // Добавляем слушатели событий на все поля ввода
    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        isValid(formElement, inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
    });
  });
}

function isValid(formElement, inputElement, config) {
  const isInputValid = inputElement.validity.valid;

  if (!isInputValid) {
    showInputError(inputElement, inputElement.validationMessage, config);
  } else if (inputElement.name === 'name' || inputElement.name === 'place-name') {
    if (!validCharsRegex.test(inputElement.value)) {
      showInputError(inputElement, inputElement.dataset.errorMessage, config);
    } else {
      hideInputError(inputElement, config);
    }
  } else if (inputElement.name === 'link' || inputElement.name === 'avatar-url') {
    if (!urlRegex.test(inputElement.value)) {
      showInputError(inputElement, inputElement.dataset.errorMessage, config);
    } else {
      hideInputError(inputElement, config);
    }
  } else {
    hideInputError(inputElement, config);
  }

  return isInputValid;
}

function showInputError(inputElement, errorMessage, config) {
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (errorElement) {
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  } else {
    console.error(`showInputError: элемент ошибки для ${inputElement.id} не найден`);
  }
}

function hideInputError(inputElement, config) {
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (errorElement) {
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
}

export function toggleButtonState(inputList, buttonElement, config) {
  const hasInvalidInput = Array.from(inputList).some(
    (inputElement) => !inputElement.validity.valid
  );

  if (hasInvalidInput) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
}

export function clearValidation(formElement, config) {
  if (!formElement || !config) {
    console.error('clearValidation: formElement или config не заданы');
    return;
  }

  const inputList = formElement.querySelectorAll(config.inputSelector);
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  if (!inputList || !buttonElement) {
    console.error('clearValidation: поля ввода или кнопка не найдены');
    return;
  }

  inputList.forEach((inputElement) => {
    const errorElement = document.getElementById(`${inputElement.id}-error`);
    if (errorElement) {
      inputElement.classList.remove(config.inputErrorClass);
      errorElement.textContent = '';
      errorElement.classList.remove(config.errorClass);
    }
  });

  toggleButtonState(inputList, buttonElement, config);
}