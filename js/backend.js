'use strict';

(function () {

  window.OFFERS = [];
  window.PIN_LIMIT = 5;
  var DEBOUNCE_PAGE_INTERVAL = 3000;

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
    errorPopup.style = 'position: fixed;\n' +
      '    top: 0;\n' +
      '    left: 0;\n' +
      '    width: 100%;\n' +
      '    height: 100%;\n' +
      '    background: rgba(0, 0, 0, 0.8);\n' +
      '    font-size: 50px;\n' +
      '    color: #fff;\n' +
      '    box-shadow: 0px 0px 25px red;\n' +
      '    border: 4px solid red;\n' +
      '    padding: 200px 50px;\n' +
      '    text-align: center;\n' +
      '    z-index: 99;';
    errorPopup.textContent = message;
    document.body.insertAdjacentElement('afterbegin', errorPopup);
  };


  var onDownloadSuccess = function (data) {
    window.OFFERS = data;
    var limitOffers = OFFERS.slice(0,PIN_LIMIT);
    for (var i = 0; i < limitOffers.length; i++) {
      var offer = limitOffers[i];
      window.pin.createPin(offer);
    }
  };

  var onUploadSucces = function (evt) {
    console.log(evt);
    var setDefaultPageDebounce = window.util.setDebounce(window.map.setDefaultPage, DEBOUNCE_PAGE_INTERVAL);
    successForm.classList.remove('hidden');
    setDefaultPageDebounce();
  };

  var upload = function (data) {
    var xhr = setup(onUploadSucces, onError);
    xhr.open('POST', URL_UPLOAD);
    if(xhr.readyState === 1){
      sendButton.innerText = 'Отправляю';
      sendButton.setAttribute('disabled', true);
    }
    xhr.send(data);
  };

  var download = function () {
    var xhr = setup(onDownloadSuccess, onError);
    xhr.open('GET', URL_DOWNLOAD);
    xhr.send();
  };


  window.backend = {
    download: download,
    upload: upload
  };

})();
