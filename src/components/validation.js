function showInputError(form, input, settings) {
  const errorElement = form.querySelector(`#${input.name}-error`);
  if (!errorElement) return;

  input.classList.add(settings.inputErrorClass);

  if (
    input.dataset.error &&
    input.validity.customError &&
    !input.validity.valueMissing
  ) {
    errorElement.textContent = input.dataset.error;
  } else {
    errorElement.textContent = input.validationMessage;
  }

  errorElement.classList.add(settings.errorClass);
}

function hideInputError(form, input, settings) {
  const errorElement = form.querySelector(`#${input.name}-error`);
  if (!errorElement) return;

  input.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = '';
}

function checkInputValidity(form, input, settings) {
  const regex = /^[A-Za-zА-Яа-яЁё\s\-]+$/;

  // очищаем кастомную ошибку перед проверками
  input.setCustomValidity('');

  if (input.validity.valueMissing) {
  }
  else if (
    ['name', 'place-name', 'description'].includes(input.name) &&
    !regex.test(input.value)
  ) {
    input.setCustomValidity(input.dataset.error || 'Недопустимые символы');
  }

  // 3. показываем ошибку, если поле всё ещё невалидно
  if (!input.validity.valid) {
    showInputError(form, input, settings);
    return false;
  }

  hideInputError(form, input, settings);
  return true;
}



function toggleButtonState(inputs, button, settings) {
  const hasInvalid = inputs.some((input) => !input.validity.valid);
  button.disabled = hasInvalid;
  button.classList.toggle(settings.inactiveButtonClass, hasInvalid);
}

function setEventListeners(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputs, button, settings);

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      checkInputValidity(form, input, settings);
      toggleButtonState(inputs, button, settings);
    });
  });
}

export function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach((form) => {
    setEventListeners(form, settings);
  });
}

export function clearValidation(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => hideInputError(form, input, settings));

  // Сброс кнопки
  button.disabled = true;
  button.classList.add(settings.inactiveButtonClass);
}


