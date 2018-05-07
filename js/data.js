'use strict';

(function () {

  var OFFERS = [];
  var DEBOUNCE_PAGE_INTERVAL = 3000;

  var onDownloadSuccess = function (data) {
    OFFERS.push.apply(OFFERS, data);
    window.pin.generate(OFFERS);
  };

  var onUploadSucces = function () {
    var setDefaultPageDebounce = window.util.setDebounce(window.map.setDefaultPage, DEBOUNCE_PAGE_INTERVAL);
    window.map.setClassName(window.map.successPopup, 'hidden', true);
    setDefaultPageDebounce();
  };

  window.backend.download(onDownloadSuccess);

  window.form.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(window.form.adForm);
    if (window.form.avatarFile !== 0) {
      formData.append('avatar', window.form.avatarFile[0]);
    }
    if (window.form.arrPhotoFeatures.length !== 0) {
      window.form.arrPhotoFeatures.forEach(function (file) {
        formData.append('images[]', file);
      });
    }
    window.backend.upload(formData, onUploadSucces);
  });

  window.data = {
    OFFERS: OFFERS
  };

})();
