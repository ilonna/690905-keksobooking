'use strict';

(function () {

  var adForm = document.querySelector('.ad-form');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');
  var typeSelect = adForm.querySelector('#type');
  var priceSelect = adForm.querySelector('#price');
  var titleField = adForm.querySelector('#title');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var avatarField = adForm.querySelector('#avatar');
  var imagesField = adForm.querySelector('#images');
  var avaUploadContainer = adForm.querySelector('.ad-form-header__upload');
  var avaPreviewContainer = avaUploadContainer.querySelector('.ad-form-header__preview');
  var avatarAreaDrop = avaUploadContainer.querySelector('.ad-form-header__drop-zone');
  var imgPreviewAvatar = avaPreviewContainer.querySelector('img');
  var photoUploadContainer = adForm.querySelector('.ad-form__photo-container');
  var photoPreviewContainer = photoUploadContainer.querySelector('.ad-form__photo');
  var photoAreaDrop = photoUploadContainer.querySelector('.ad-form__drop-zone');

  var defaultSrcAva = 'img/muffin-grey.svg';
  var photoFeaturesFiles = [];
  var avatarFiles = [];
  var draggedBlock = null;
  var messageAreaDrop = {
    error: 'Файл не является изображением',
    primary: 'Загрузите или&nbsp;перетащите сюда фото'
  };

  var setImageReset = function () {
    photoFeaturesFiles.length = 0;
    avatarFiles.length = 0;
  };

  var setDefaultAva = function () {
    imgPreviewAvatar.src = defaultSrcAva;
    imgPreviewAvatar.style.cssText = '';
    avatarAreaDrop.innerHTML = messageAreaDrop.primary;
    window.map.setClassName(avatarAreaDrop, 'error', true);
  };

  var setDefaultPhotoList = function () {
    var photoFirstContainer = photoUploadContainer.querySelector('.ad-form__photo');
    var imgElementPhotoContainer = photoFirstContainer.querySelector('img');
    var photoContainers = Array.from(photoUploadContainer.querySelectorAll('.ad-form__photo'));
    if (imgElementPhotoContainer) {
      photoFirstContainer.removeChild(imgElementPhotoContainer);
    }
    for (var i = 1; i < photoContainers.length; i++) {
      photoContainers[i].remove();
    }
    photoAreaDrop.innerHTML = messageAreaDrop.primary;
    window.map.setClassName(photoAreaDrop, 'error', true);
  };

  var setReset = function () {
    var errorMessage = adForm.querySelectorAll('.error-message');
    var errorContainers = adForm.querySelectorAll('.error');
    adForm.reset();
    window.util.elementsClassRemove(errorContainers, 'error');
    window.util.elementsRemove(errorMessage);
    setDefaultPhotoList();
    setDefaultAva();
    setImageReset();
  };

  var changeTime = function (select) {
    var indexSelectOption = select.selectedIndex;
    if (select === timeInSelect) {
      timeOutSelect.options[indexSelectOption].selected = true;
    } else {
      timeInSelect.options[indexSelectOption].selected = true;
    }
  };

  var changeMinPrice = function () {
    var valueSelectType = typeSelect.options[typeSelect.selectedIndex].getAttribute('value');
    switch (valueSelectType) {
      case 'flat':
        priceSelect.setAttribute('min', '1000');
        priceSelect.setAttribute('placeholder', '1000');
        break;
      case 'bungalo':
        priceSelect.setAttribute('min', '0');
        priceSelect.setAttribute('placeholder', '0');
        break;
      case 'house':
        priceSelect.setAttribute('min', '5000');
        priceSelect.setAttribute('placeholder', '5000');
        break;
      case 'palace':
        priceSelect.setAttribute('min', '10000');
        priceSelect.setAttribute('placeholder', '10000');
        break;
    }
  };

  var changeCapacity = function () {
    var indexSelectedRoom = roomNumberSelect.selectedIndex;
    var valueSelectedRoom = roomNumberSelect.options[indexSelectedRoom].getAttribute('value');
    var capacitySelectOptions = capacitySelect.options;

    Array.from(roomNumberSelect).forEach(function (value, index) {
      capacitySelect.options[index].disabled = true;
    });

    var selArray = Array.from(capacitySelectOptions).filter(function (el) {
      if (valueSelectedRoom === '0' || valueSelectedRoom === '1') {
        return el.value === valueSelectedRoom;
      } else if (valueSelectedRoom === '2') {
        return el.value <= valueSelectedRoom && el.value !== '0';
      } else {
        return el.value <= valueSelectedRoom && el.value !== '0';
      }
    });

    selArray.forEach(function (value) {
      capacitySelect.options[value.index].disabled = false;
    });
  };


  var previewPhoto = function (files, labelDrop, photoContainer) {
    var photoFile;
    var photoBlock = photoUploadContainer.querySelector('.ad-form__photo');
    for (var i = 0; i < files.length; i++) {
      photoFile = files[i];
      if (/image.*/.test(photoFile.type)) {
        var photoTemplate = photoPreviewContainer.cloneNode(true);
        var imgPhoto = document.createElement('img');
        if (photoBlock.childNodes.length === 0) {
          photoBlock.remove();
        }
        photoFeaturesFiles.push(photoFile);
        imgPhoto.src = window.URL.createObjectURL(photoFile);
        labelDrop.innerHTML = messageAreaDrop.primary;
        window.map.setClassName(labelDrop, 'error', true);
        photoTemplate.appendChild(imgPhoto);
        photoTemplate.setAttribute('id', 'block-image-' + i);
        photoContainer.appendChild(photoTemplate);
        window.URL.revokeObjectURL(photoFile);
        photoTemplate.addEventListener('dragstart', onImageDragStart, false);
        photoTemplate.addEventListener('dragover', onImageDragOver, false);
        photoTemplate.addEventListener('dragleave', onImageDragLeave, false);
        photoTemplate.addEventListener('drop', onImageDrop, false);
      } else {
        labelDrop.innerHTML = messageAreaDrop.error;
        window.map.setClassName(labelDrop, 'error', false);
      }
    }
    imagesField.value = '';
  };


  var previewAvatar = function (files, labelDrop) {
    var avaFile = files[0];
    if (files.length === 0) {
      setDefaultAva();
    } else {
      if (/image.*/.test(avaFile.type)) {
        avatarFiles.push(avaFile);
        imgPreviewAvatar.src = window.URL.createObjectURL(avaFile);
        imgPreviewAvatar.style.cssText = 'width: auto; height: auto; margin: 0;';
        labelDrop.innerHTML = messageAreaDrop.primary;
        window.map.setClassName(labelDrop, 'error', true);
        window.URL.revokeObjectURL(avaFile);
      } else {
        setDefaultAva();
        labelDrop.innerHTML = messageAreaDrop.error;
        window.map.setClassName(labelDrop, 'error', false);
      }
    }
    avatarField.value = '';
  };


  var stopDefault = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  };

  var onAreaDragEnter = function (evt) {
    stopDefault(evt);
    evt.target.style.boxShadow = '0 0 10px 3px #ff5635';
  };

  var onAreaDragLeave = function (evt) {
    stopDefault(evt);
    evt.target.style.boxShadow = '';
  };

  var onAreaDrop = function (evt) {
    stopDefault(evt);
    var elmTarget = evt.target;
    var files = evt.dataTransfer.files;
    if (elmTarget === avatarAreaDrop) {
      previewAvatar(files, avatarAreaDrop);
    } else {
      previewPhoto(files, photoAreaDrop, photoUploadContainer);
    }
    elmTarget.style.boxShadow = '';
  };

  avatarAreaDrop.addEventListener('dragenter', onAreaDragEnter, false);
  avatarAreaDrop.addEventListener('dragover', onAreaDragEnter, false);
  avatarAreaDrop.addEventListener('dragleave', onAreaDragLeave, false);
  avatarAreaDrop.addEventListener('drop', onAreaDrop, false);

  photoAreaDrop.addEventListener('dragenter', onAreaDragEnter, false);
  photoAreaDrop.addEventListener('dragover', onAreaDragEnter, false);
  photoAreaDrop.addEventListener('dragleave', onAreaDragLeave, false);
  photoAreaDrop.addEventListener('drop', onAreaDrop, false);


  var onImageDragStart = function (evt) {
    draggedBlock = evt.currentTarget;
  };

  var onImageDragOver = function (evt) {
    evt.preventDefault();
    var thisOver = evt.currentTarget;
    thisOver.classList.add('drag-over');
  };

  var onImageDragLeave = function (evt) {
    var thisLeave = evt.currentTarget;
    thisLeave.classList.remove('drag-over');
  };

  var onImageDrop = function (evt) {
    evt.preventDefault();
    var whereDrop = evt.currentTarget;
    photoUploadContainer.insertBefore(draggedBlock, whereDrop);
    draggedBlock = null;
    whereDrop.classList.remove('drag-over');
  };


  var showError = function (element, errorMessage) {
    var parentContainer = element.parentNode;
    resetError(element);
    var msgElement = document.createElement('div');
    msgElement.className = 'error-message';
    msgElement.innerHTML = errorMessage;
    element.setCustomValidity(errorMessage);
    element.classList.add('error');
    parentContainer.appendChild(msgElement);
  };

  var resetError = function (element) {
    var parentContainer = element.parentNode;
    if (parentContainer.lastChild.className === 'error-message') {
      parentContainer.removeChild(parentContainer.lastChild);
      element.setCustomValidity('');
      element.classList.remove('error');
    }
  };


  var onElementChange = function (evt) {
    var element = evt.target;

    if (element === titleField) {
      var msgErrTitle = 'Обязательое поле. Длина заголовка должна быть от 30 до 100 символов. Длина сейчас: ' + element.value.length;
      if (element.validity.tooShort || element.validity.tooLong || element.validity.valueMissing) {
        showError(element, msgErrTitle);
      } else {
        resetError(element);
      }
    }

    if (element === typeSelect) {
      changeMinPrice();
    }

    if (element === priceSelect) {
      var minPrice = element.getAttribute('min');
      var typeHome = typeSelect.options[typeSelect.selectedIndex].text;
      var msgErrPrice = typeHome + ': min = ' + minPrice + ', max = 1000000';
      if (element.validity.rangeOverflow || element.validity.rangeUnderflow || element.validity.valueMissing) {
        showError(element, msgErrPrice);
      } else {
        resetError(element);
      }
    }

    if (element === capacitySelect || element === roomNumberSelect) {
      changeCapacity();
      var roomsValue = roomNumberSelect.options[roomNumberSelect.selectedIndex].value;
      var capacityValue = capacitySelect.options[capacitySelect.selectedIndex].value;
      var msgErrCapacity = 'Кол-во гостей не соотвествует кол-ву комнат';

      if (((roomsValue === '0') && (capacityValue === '0')) ||
        ((roomsValue === '1') && (capacityValue === '1')) ||
        ((roomsValue === '2') && ((capacityValue === '1') || (capacityValue === '2'))) ||
        ((roomsValue === '3') && ((capacityValue === '1') || (capacityValue === '2') || (capacityValue === '3')))) {
        resetError(capacitySelect);
      } else {
        showError(capacitySelect, msgErrCapacity);
      }
    }

    if (element === timeInSelect || element === timeOutSelect) {
      changeTime(element);
    }

    if (element === avatarField) {
      var avaFile = element.files;
      previewAvatar(avaFile, avatarAreaDrop);
    }

    if (element === imagesField) {
      var imgFile = element.files;
      previewPhoto(imgFile, photoAreaDrop, photoUploadContainer);
    }

  };

  window.form = {
    onElementChange: onElementChange,
    adForm: adForm,
    setReset: setReset,
    arrPhotoFeatures: photoFeaturesFiles,
    avatarFile: avatarFiles
  };

})();
