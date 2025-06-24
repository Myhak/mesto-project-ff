export function enableValidation(config) {
  const formList = document.querySelectorAll(config.formSelector);

  formList.forEach((formElement) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector)); // Преобразуем NodeList в массив
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    // Устанавливаем начальное состояние кнопки
    toggleButtonState(inputList, buttonElement, config);

    // Добавляем слушатели событий на поля ввода
    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        isValid(formElement, inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
    });
  });
}

function isValid(formElement, inputElement, config) {
  if (inputElement.validity.patternMismatch && inputElement.dataset.errorMessage) {
    showInputError(inputElement, inputElement.dataset.errorMessage, config);
  } else if (!inputElement.validity.valid) {
    showInputError(inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(inputElement, config);
  }
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
  const hasInvalidInput = inputList.some((inputElement) => !inputElement.validity.valid); // Теперь inputList — это массив

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

  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  if (!inputList.length || !buttonElement) {
    console.error('clearValidation: поля ввода или кнопка не найдены');
    return;
  }

  inputList.forEach((inputElement) => {
    hideInputError(inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
}