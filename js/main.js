'use strict';

(function () {

  window.backend.download();
  window.map.setDefaultPage();

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(adForm);
    if(avatarFile !== 0){
      formData.append('avatar', avatarFile);
    }
    if(arrPhotoFeatures.length !== 0){
      arrPhotoFeatures.forEach(function (file) {
        formData.append('images[]', file);
      });
    }
    window.backend.upload(formData);
  });

}());
