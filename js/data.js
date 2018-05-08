'use strict';

(function () {

  var DEBOUNCE_PAGE_INTERVAL = 3000;
  var adsList = [];

  var onDownloadSuccess = function (data) {
    adsList.push.apply(adsList, data);
    window.pin.generate(adsList);
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
    if (window.form.featureImages.length !== 0) {
      window.form.featureImages.forEach(function (file) {
        formData.append('images[]', file);
      });
    }
    window.backend.upload(formData, onUploadSucces);
  });

  window.data = {
    adsList: adsList
  };

})();
