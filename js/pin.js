'use strict';

(function () {

  var DOT_PIN_X = 25;
  var DOT_PIN_Y = 70;
  var ESC_KEYCODE = 27;
  var PIN_LIMIT = 5;
  var PIN_TEMPLATE = window.card.TEMPLATE.content.querySelector('.map__pin');
  var buttonClosePopup = window.card.cardContainer.querySelector('.popup__close');
  var pinsContainer = window.card.container.querySelector('.map__pins');

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.card.removeCard();
    }
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var setStatusPins = function (show, remove) {
    var pinArray = Array.from(pinsContainer.querySelectorAll('.map__pin'));
    pinArray.forEach(function (item) {
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
    var pinElement = PIN_TEMPLATE.cloneNode(true);
    var pinElementImg = pinElement.querySelector('img');
    pinElement.setAttribute('style', 'left:' + (offer.location.x - DOT_PIN_X) + 'px; top: ' + (offer.location.y - DOT_PIN_Y) + 'px;');
    pinElement.classList.add('hidden');
    pinElementImg.src = offer.author.avatar;
    pinElementImg.alt = offer.offer.title;
    pinsContainer.appendChild(pinElement);
    pinElement.addEventListener('click', function () {
      window.card.generateCard(offer);
      buttonClosePopup.addEventListener('click', window.card.removeCard);
      document.addEventListener('keydown', onPopupEscPress);
    });
  };

  var generatePins = function (data) {
    var limitOffers = data.slice(0, PIN_LIMIT);
    limitOffers.forEach(function (offer) {
      createPin(offer);
    });
  };

  window.pin = {
    createPin: createPin,
    generatePins: generatePins,
    setStatusPins: setStatusPins,
    pinsContainer: pinsContainer,
    PIN_LIMIT: PIN_LIMIT
  };

})();
