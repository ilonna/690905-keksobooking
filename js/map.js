'use strict';

(function () {

  var OFFERS_COUNT = 8;
  var PIN_DEFAULT_TOP = 375;
  var PIN_DEFAULT_LEFT = 570;

  var pinMainElement = pinsContainer.querySelector('.map__pin--main');
  var imgPinElement = pinMainElement.querySelector('img');

  var inputAddress = adForm.querySelector('#address');
  var fieldsetElements = adForm.querySelectorAll('fieldset');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var sendButton = adForm.querySelector('.ad-form__submit');
  var successForm = document.querySelector('.success');

  window.removeCard = function () {
    cardContainer.remove();
  };

  window.onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeCard();
    }
  };

  var setAttributeFormElements = function (selector, status) {
    selector.forEach(function (element) {
      if (status) {
        element.removeAttribute('disabled', true);
      } else {
        element.setAttribute('disabled', true);
      }
    });
  };

  window.setClassName = function (selector, className, status) {
    if (status) {
      selector.classList.remove(className);
    } else {
      selector.classList.add(className);
    }
  };

  var setCoordDotMap = function (endX, endY) {
    var dot = {
      top: endY + (imgPinElement.offsetHeight + parseInt(getComputedStyle(pinMainElement, '::after').height, 10)),
      left: endX + Math.round(parseInt(getComputedStyle(pinMainElement).width, 10) / 2)
    };
    inputAddress.setAttribute('value', dot.left + ', ' + dot.top);
  };


  /* ------- drag&drop -----------------------*/
  pinMainElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var limitCoords = {
      top: pinsContainer.offsetTop,
      right: pinsContainer.offsetWidth - pinMainElement.offsetWidth,
      bottom: pinsContainer.offsetHeight - imgPinElement.offsetHeight - parseInt(getComputedStyle(pinMainElement, '::after').height, 10),
      left: pinsContainer.offsetLeft
    };

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      imgPinElement.removeAttribute('style');
      document.removeEventListener('mouseup', onMouseUp);
      activatePage();
    };

    var onMouseLeave = function (leaveEvt) {
      leaveEvt.preventDefault();
      imgPinElement.setAttribute('style', 'box-shadow: none');
      onMouseUp(leaveEvt);
      pinsContainer.removeEventListener('mouseleave', onMouseLeave);
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var endCoords = {
        x: pinMainElement.offsetLeft - shift.x,
        y: pinMainElement.offsetTop - shift.y
      };

      if (endCoords.x > limitCoords.right) {
        endCoords.x = limitCoords.right;
      }
      if (endCoords.x < limitCoords.left) {
        endCoords.x = limitCoords.left;
      }
      if (endCoords.y > limitCoords.bottom) {
        endCoords.y = limitCoords.bottom;
      }
      if (endCoords.y < limitCoords.top) {
        endCoords.y = limitCoords.top;
      }

      pinMainElement.style.left = endCoords.x + 'px';
      pinMainElement.style.top = endCoords.y + 'px';

      setCoordDotMap(endCoords.x, endCoords.y);

      pinsContainer.addEventListener('mouseleave', onMouseLeave);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  var sendForm = function (evt) {
    /*  successForm.classList.remove('hidden');
      setTimeout(successForm.classList.add('hidden'), 4000);*/
  };


  var setStatusPage = function (status) {
    pinsContainer.querySelectorAll('.map__pin').forEach(function (element) {
      setClassName(element, 'hidden', status);
    });
    setClassName(container, 'map--faded', status);
    setClassName(adForm, 'ad-form--disabled', status);
    setAttributeFormElements(fieldsetElements, status);
  };

  var setDefaultPage = function () {
    setStatusPage(false);
    adForm.reset();
    removeCard();
    pinMainElement.setAttribute('style', 'left: ' + PIN_DEFAULT_LEFT + 'px; top: ' + PIN_DEFAULT_TOP + 'px;');
    successForm.classList.add('hidden');
  };

  var activatePage = function () {
    setStatusPage(true);
    setCoordDotMap(parseInt(getComputedStyle(pinMainElement).left, 10), parseInt(getComputedStyle(pinMainElement).top, 10));
    resetButton.addEventListener('click', setDefaultPage);
    sendButton.addEventListener('click', sendForm);
    adForm.addEventListener('change', validateForm);
  };

  createCards(OFFERS_COUNT);
  setDefaultPage();


})();
