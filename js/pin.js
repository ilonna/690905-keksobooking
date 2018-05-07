'use strict';

(function () {

  var DOT_PIN_X = 25;
  var DOT_PIN_Y = 70;
  var ESC_KEYCODE = 27;
  var LIMIT_GENERATE = 5;
  var pinTemplate = window.card.templateLayout.content.querySelector('.map__pin');
  var closePopup = window.card.container.querySelector('.popup__close');
  var mapPinsContainer = window.card.mapContainer.querySelector('.map__pins');

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.card.container.remove();
    }
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var setStatusPins = function (show, remove) {
    var pinsArray = Array.from(mapPinsContainer.querySelectorAll('.map__pin'));
    pinsArray.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        if (show === true) {
          item.classList.remove('hidden');
        } else if (show === false) {
          item.classList.add('hidden');
        } else if (remove === true) {
          item.remove();
        }
      }
    });
  };

  var createPin = function (offer) {
    var pin = pinTemplate.cloneNode(true);
    var imgPin = pin.querySelector('img');
    pin.setAttribute('style', 'left:' + (offer.location.x - DOT_PIN_X) + 'px; top: ' + (offer.location.y - DOT_PIN_Y) + 'px;');
    pin.classList.add('hidden');
    imgPin.src = offer.author.avatar;
    imgPin.alt = offer.offer.title;
    mapPinsContainer.appendChild(pin);
    pin.addEventListener('click', function () {
      window.card.generate(offer);
      closePopup.addEventListener('click', window.card.onRemoveClick);
      document.addEventListener('keydown', onPopupEscPress);
    });
  };

  var generatePins = function (data) {
    var offersLimit = data.slice(0, LIMIT_GENERATE);
    offersLimit.forEach(function (offer) {
      createPin(offer);
    });
  };

  window.pin = {
    create: createPin,
    generate: generatePins,
    setStatus: setStatusPins,
    container: mapPinsContainer,
    LIMIT_GENERATE: LIMIT_GENERATE
  };

})();
