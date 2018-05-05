'use strict';

(function () {

  var DOT_PIN_X = 25;
  var DOT_PIN_Y = 70;
  var ESC_KEYCODE = 27;
  var PIN_TEMPLATE = window.card.TEMPLATE.content.querySelector('.map__pin');
  var buttonClosePopup = window.card.cardContainer.querySelector('.popup__close');
  var pinsContainer = window.card.container.querySelector('.map__pins');

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.map.removeCard();
    }
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var createPin = function (offer, delHidden) {
    var pinElement = PIN_TEMPLATE.cloneNode(true);
    var pinElementImg = pinElement.querySelector('img');
    pinElement.setAttribute('style', 'left:' + (offer.location.x - DOT_PIN_X) + 'px; top: ' + (offer.location.y - DOT_PIN_Y) + 'px;');
    pinElement.classList.add('hidden');
    pinElementImg.src = offer.author.avatar;
    pinElementImg.alt = offer.offer.title;
    pinsContainer.appendChild(pinElement);
    pinElement.addEventListener('click', function () {
      window.card.generateOffers(offer);
      buttonClosePopup.addEventListener('click', window.map.removeCard);
      document.addEventListener('keydown', onPopupEscPress);
    });
    if(delHidden) {
      pinElement.classList.remove('hidden');
    }
  };

  window.pin = {
    createPin: createPin,
    pinsContainer: pinsContainer
  }

})();
