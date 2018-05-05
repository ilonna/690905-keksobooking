'use strict';

(function () {

  window.backend.download();
  window.map.setDefaultPage();

  window.form.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(window.form.adForm);
    if(window.form.avatarFile !== 0){
      formData.append('avatar', window.form.avatarFile);
    }
    if(window.form.arrPhotoFeatures.length !== 0){
      window.form.arrPhotoFeatures.forEach(function (file) {
        formData.append('images[]', file);
      });
    }
    window.backend.upload(formData);
  });

}());
