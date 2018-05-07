'use strict';

(function () {

  var onCheckboxBlur = function (evt) {
    var thisBlur = evt.target;
    thisBlur.removeEventListener('keydown', onCheckboxEnter);
    thisBlur.removeEventListener('blur', onCheckboxBlur);
  };
  var onCheckboxEnter = function (evt) {
    if (evt.keyCode === window.map.ENTER_KEYCODE) {
      evt.stopPropagation();
      evt.preventDefault();
      var thisEnter = evt.target;
      if (thisEnter.checked) {
        thisEnter.checked = false;
        if (thisEnter.getAttribute('data-id') === 'features-filter') {
          window.filter.onChange(evt);
        }
      } else {
        thisEnter.checked = true;
        if (thisEnter.getAttribute('data-id') === 'features-filter') {
          window.filter.onChange(evt);
        }
      }
    }
  };
  var onCheckboxFocus = function (evt) {
    var thisFocus = evt.target;
    thisFocus.addEventListener('keydown', onCheckboxEnter);
    thisFocus.addEventListener('blur', onCheckboxBlur);
  };

  var addFocusListener = function (checkboxList) {
    checkboxList.forEach(function (value) {
      value.addEventListener('focus', onCheckboxFocus);
    });
  };

  var elementsRemove = function (elements) {
    elements.forEach(function (value) {
      value.remove();
    });
  };

  var elementsClassRemove = function (elements, classRemove) {
    elements.forEach(function (value) {
      value.classList.remove(classRemove);
    });
  };


  var setDebounce = function (fun, interval) {
    var lastTimeout;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
        lastTimeout = null;
      }, interval);
    };
  };


  window.util = {
    addFocusListener: addFocusListener,
    setDebounce: setDebounce,
    elementsRemove: elementsRemove,
    elementsClassRemove: elementsClassRemove
  };


})();
