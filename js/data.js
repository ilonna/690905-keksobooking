'use strict';

(function () {

  var DEBOUNCE_PAGE_INTERVAL = 3000;

  var onDownloadSuccess = function (data) {
    window.backend.OFFERS = data;
    var limitOffers = window.backend.OFFERS.slice(0, window.backend.PIN_LIMIT);
    limitOffers.forEach(function (offer) {
      window.pin.createPin(offer);
    });
  };

  var onUploadSucces = function (evt) {
    var setDefaultPageDebounce = window.util.setDebounce(window.map.setDefaultPage, DEBOUNCE_PAGE_INTERVAL);
    window.map.setClassName(window.map.successForm, 'hidden', true);
    setDefaultPageDebounce();
  };

  window.backend.download(onDownloadSuccess);

  window.form.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(window.form.adForm);
    if (window.form.avatarFile !== 0) {
      formData.append('avatar', window.form.avatarFile);
    }
    if (window.form.arrPhotoFeatures.length !== 0) {
      window.form.arrPhotoFeatures.forEach(function (file) {
        formData.append('images[]', file);
      });
    }
    window.backend.upload(formData, onUploadSucces);
  });

  window.map.setDefaultPage();
})();
