'use strict';

(function () {

  var PIN_DEFAULT_TOP = 375;
  var PIN_DEFAULT_LEFT = 570;
  var ENTER_KEYCODE = 13;
  var LIMIT_PIN_TOP = 150;
  var LIMIT_PIN_BOTTOM = 500;

  var pinMain = window.pin.container.querySelector('.map__pin--main');
  var imgPinMain = pinMain.querySelector('img');
  var addressField = window.form.adForm.querySelector('#address');
  var fieldSets = window.form.adForm.querySelectorAll('fieldset');
  var resetButton = window.form.adForm.querySelector('.ad-form__reset');
  var sendButton = window.form.adForm.querySelector('.ad-form__submit');
  var featureFieldSets = Array.from(window.form.adForm.querySelectorAll('.features input'));
  var successPopup = document.querySelector('.success');

  var setAttributeElementsForm = function (selector, status) {
    selector.forEach(function (element) {
      if (status) {
        element.removeAttribute('disabled', true);
      } else {
        element.setAttribute('disabled', true);
      }
    });
  };

  var setCoordDotMap = function (endX, endY) {
    var dot = {
      top: endY + (imgPinMain.offsetHeight + parseInt(getComputedStyle(pinMain, '::after').height, 10)),
      left: endX + Math.round(parseInt(getComputedStyle(pinMain).width, 10) / 2)
    };
    addressField.setAttribute('value', dot.left + ', ' + dot.top);
  };

  var setStatusPage = function (status) {
    window.pin.setStatus(status, null);
    setClassName(window.card.mapContainer, 'map--faded', status);
    setClassName(window.form.adForm, 'ad-form--disabled', status);
    setAttributeElementsForm(fieldSets, status);
  };

  var activatePage = function () {
    setStatusPage(true);
    setCoordDotMap(parseInt(getComputedStyle(pinMain).left, 10), parseInt(getComputedStyle(pinMain).top, 10));
    resetButton.addEventListener('click', onSetDefaultPage);
    window.util.addFocusListener(window.filter.featureFilter);
    window.util.addFocusListener(featureFieldSets);
    window.form.adForm.addEventListener('change', window.form.onElementChange);
  };


  var onPinEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activatePage();
    }
    pinMain.removeEventListener('keydown', onPinEnterPress);
  };

  var setClassName = function (selector, className, status) {
    if (status) {
      selector.classList.remove(className);
    } else {
      selector.classList.add(className);
    }
  };

  var setDefaultPage = function () {
    setStatusPage(false);
    window.form.setReset();
    window.card.container.remove();
    pinMain.setAttribute('style', 'left: ' + PIN_DEFAULT_LEFT + 'px; top: ' + PIN_DEFAULT_TOP + 'px;');
    sendButton.innerText = 'Опубликовать';
    sendButton.removeAttribute('disabled', true);
    setClassName(successPopup, 'hidden', false);
    pinMain.addEventListener('keydown', onPinEnterPress);
  };

  var onSetDefaultPage = function () {
    setDefaultPage();
  };


  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var limitCoords = {
      top: LIMIT_PIN_TOP,
      right: window.pin.container.offsetWidth - pinMain.offsetWidth,
      bottom: LIMIT_PIN_BOTTOM,
      left: window.pin.container.offsetLeft
    };

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      activatePage();
    };

    var onMouseLeave = function (leaveEvt) {
      leaveEvt.preventDefault();
      onMouseUp(leaveEvt);
      window.pin.container.removeEventListener('mouseleave', onMouseLeave);
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
        x: pinMain.offsetLeft - shift.x,
        y: pinMain.offsetTop - shift.y
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

      pinMain.style.left = endCoords.x + 'px';
      pinMain.style.top = endCoords.y + 'px';

      setCoordDotMap(endCoords.x, endCoords.y);
      activatePage();
      window.pin.container.addEventListener('mouseleave', onMouseLeave);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    setClassName: setClassName,
    setDefaultPage: setDefaultPage,
    sendButton: sendButton,
    successPopup: successPopup,
    ENTER_KEYCODE: ENTER_KEYCODE
  };
})();
