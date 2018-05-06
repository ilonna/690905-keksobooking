'use strict';

(function () {

  var lastTimeout;

  var onBlurCheckbox = function (evt) {
    var thisBlur = evt.target;
    thisBlur.removeEventListener('keydown', onEnterCheckbox);
    thisBlur.removeEventListener('blur', onBlurCheckbox);
  };
  var onEnterCheckbox = function (evt) {
    if (evt.keyCode === window.map.ENTER_KEYCODE) {
      evt.stopPropagation();
      evt.preventDefault();
      var thisEnter = evt.target;
      if (thisEnter.checked) {
        thisEnter.checked = false;
        if (thisEnter.getAttribute('data-id') === 'features-filter') {
          window.filter.changeFilter(evt);
        }
      } else {
        thisEnter.checked = true;
        if (thisEnter.getAttribute('data-id') === 'features-filter') {
          window.filter.changeFilter(evt);
        }
      }
    }
  };
  var onFocusCheckbox = function (evt) {
    var thisFocus = evt.target;
    thisFocus.addEventListener('keydown', onEnterCheckbox);
    thisFocus.addEventListener('blur', onBlurCheckbox);
  };

  var addFocusListener = function (checkboxList) {
    checkboxList.forEach(function (value) {
      value.addEventListener('focus', onFocusCheckbox);
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
    setDebounce: setDebounce
  };


})();
