const urlReg = /https?:\/\/(?:www\.)?\w+\.\w+(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?(?:#\w*)?/;
const ErrorBadRequest = 'Вы ввели некорректные данные';
const ErrorNotFound = 'Не найдено';
const ErrorForbidden = 'Нет прав для удаления';
const ErrorConflict = 'Пользователь с данным email уже зарегистрирован';
const ErrorUnauthorized = 'Вы ввели неверные email и пароль';
const ErrorServer = 'Сервер сейчас упадёт';
const ServerError = 'На сервере произошла ошибка';
const UnauthorizedUser = 'Необходима авторизация';
const Exit = 'Выход';

module.exports = {
  urlReg,
  ErrorBadRequest,
  ErrorNotFound,
  ErrorForbidden,
  ErrorConflict,
  ErrorUnauthorized,
  ErrorServer,
  ServerError,
  UnauthorizedUser,
  Exit,
};
