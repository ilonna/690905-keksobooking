'use strict';

(function () {

  var TIMEOUT = 10000;
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var URL_DOWNLOAD = 'https://js.dump.academy/keksobooking/data';

  var ErrorMessages = {
    400: 'Неверный запрос',
    404: 'Страница не найдена',
    500: 'Внутренняя ошибка сервера'
  };


  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = TIMEOUT;
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        case 400:
          onError(ErrorMessages[400]);
          break;
        case 404:
          onError(ErrorMessages[404]);
          break;
        case 500:
          onError(ErrorMessages[500]);
          break;
        default:
          onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  var onError = function (message) {
    var errorPopup = document.createElement('div');
    errorPopup.classList.add('popup-error_message');
    errorPopup.textContent = message;
    document.body.insertAdjacentElement('afterbegin', errorPopup);
  };

  var upload = function (data, onSuccess) {
    var xhr = setup(onSuccess, onError);
    xhr.open('POST', URL_UPLOAD);
    if (xhr.readyState === 1) {
      window.map.sendButton.innerText = 'Отправляю';
      window.map.sendButton.setAttribute('disabled', true);
    }
    xhr.send(data);
  };

  var download = function (onSuccess) {
    var xhr = setup(onSuccess, onError);
    xhr.open('GET', URL_DOWNLOAD);
    xhr.send();
  };


  window.backend = {
    download: download,
    upload: upload
  };

})();
