'use strict';

(function () {

  var buttonClosePopup = cardContainer.querySelector('.popup__close');

  window.createPin = function (offer) {
    var pinElement = PIN_TEMPLATE.cloneNode(true);
    var pinElementImg = pinElement.querySelector('img');
    pinElement.setAttribute('style', 'left:' + offer.location.x + 'px; top: ' + offer.location.y + 'px;');
    pinElementImg.src = offer.author.avatar;
    pinElementImg.alt = offer.offer.title;
    pinsContainer.appendChild(pinElement);
    pinElement.addEventListener('click', function () {
      generateOffers(offer);
      buttonClosePopup.addEventListener('click', removeCard);
      document.addEventListener('keydown', onPopupEscPress);
    });
  };


})();
