'use strict';

(function () {

  var adForm = document.querySelector('.ad-form');
  var selectTimeIn = adForm.querySelector('#timein');
  var selectTimeOut = adForm.querySelector('#timeout');
  var selectType = adForm.querySelector('#type');
  var selectPrice = adForm.querySelector('#price');
  var inputTitle = adForm.querySelector('#title');
  var selectRoomNumber = adForm.querySelector('#room_number');
  var selectCapacity = adForm.querySelector('#capacity');
  var avatarField = adForm.querySelector('#avatar');
  var imagesField = adForm.querySelector('#images');
  var avaUploadContainer = adForm.querySelector('.ad-form-header__upload');
  var avaPreviewContainer = avaUploadContainer.querySelector('.ad-form-header__preview');
  var labelAvatarDrop = avaUploadContainer.querySelector('.ad-form-header__drop-zone');
  var imgAvatar = avaPreviewContainer.querySelector('img');
  var photoUploadContainer = adForm.querySelector('.ad-form__photo-container');
  var photoPreviewContainer = photoUploadContainer.querySelector('.ad-form__photo');
  var labelPhotoDrop = photoUploadContainer.querySelector('.ad-form__drop-zone');

  var defaultSrcAva = 'img/muffin-grey.svg';
  var arrPhotoFeatures = [];
  var avatarFile = 0;
  var messageDropImg = {
    error: 'Файл не является изображением',
    primary: 'Загрузите или&nbsp;перетащите сюда фото'
  };



  var setDefaultAva = function () {
    imgAvatar.src = defaultSrcAva;
    imgAvatar.style.cssText = '';
    labelAvatarDrop.innerHTML = messageDropImg.primary;
    window.map.setClassName(labelAvatarDrop, 'error', true);
  };

  var setDefaultPhotoList = function () {
    var firstPhotoBlock = photoUploadContainer.querySelector('.ad-form__photo');
    var imgBlock = firstPhotoBlock.querySelector('img');
    var listPhoto = Array.from(photoUploadContainer.querySelectorAll('.ad-form__photo'));
    if (imgBlock) {
      firstPhotoBlock.removeChild(imgBlock);
    }
    for(var i = 1; i < listPhoto.length; i++) {
      listPhoto[i].remove();
    }
    labelPhotoDrop.innerHTML = messageDropImg.primary;
    window.map.setClassName(labelPhotoDrop, 'error', true);
  };

  var changeTime = function (select) {
    var indexSelectOption = select.selectedIndex;
    if (select === selectTimeIn) {
      selectTimeOut.options[indexSelectOption].selected = true;
    } else {
      selectTimeIn.options[indexSelectOption].selected = true;
    }
  };

  var changeMinPrice = function () {
    var valueSelectType = selectType.options[selectType.selectedIndex].getAttribute('value');
    var inputVal = selectPrice.value;
    switch (valueSelectType) {
      case 'flat':
        selectPrice.setAttribute('min', '1000');
        selectPrice.setAttribute('placeholder', '1000');
        break;
      case 'bungalo':
        selectPrice.setAttribute('min', '0');
        selectPrice.setAttribute('placeholder', '0');
        break;
      case 'house':
        selectPrice.setAttribute('min', '5000');
        selectPrice.setAttribute('placeholder', '5000');
        break;
      case 'palace':
        selectPrice.setAttribute('min', '10000');
        selectPrice.setAttribute('placeholder', '10000');
        break;
    }
  };

  var changeCapacity = function () {
    var selectRoomIndex = selectRoomNumber.selectedIndex;
    var selectRoomValue = selectRoomNumber.options[selectRoomIndex].getAttribute('value');
    var selectCapacityOptions = selectCapacity.options;

    Array.from(selectRoomNumber).forEach(function (value, index) {
      selectCapacity.options[index].disabled = true;
    });

    var selArray = Array.from(selectCapacityOptions).filter(function (el, index) {
      if (selectRoomValue === '0' || selectRoomValue === '1') {
        return el.value === selectRoomValue;
      } else if (selectRoomValue === '2') {
        return el.value <= selectRoomValue && el.value !== '0';
      } else {
        return el.value <= selectRoomValue && el.value !== '0';
      }
    });

    selArray.forEach(function (value) {
      selectCapacity.options[value.index].disabled = false;
    });
  };


  var previewPhoto = function (files, labelDrop, photoContainer) {
    var photoFile;
    var photoBlock = photoUploadContainer.querySelector('.ad-form__photo');
    if (photoBlock.childNodes.length === 0) {
      photoBlock.remove();
    }
    for (var i = 0; i < files.length; i++) {
      photoFile = files[i];
      if (/image.*/.test(photoFile.type)) {
        arrPhotoFeatures.push(photoFile);
        var photoTemplate = photoPreviewContainer.cloneNode(true);
        var imgPhoto = document.createElement('img');
        imgPhoto.src = window.URL.createObjectURL(photoFile);
        labelDrop.innerHTML = messageDropImg.primary;
        window.map.setClassName(labelDrop, 'error', true);
        photoTemplate.appendChild(imgPhoto);

        photoContainer.appendChild(photoTemplate);
        window.URL.revokeObjectURL(photoFile);
      } else {
        labelDrop.innerHTML = messageDropImg.error;
        window.map.setClassName(labelDrop, 'error', false);
      }
    }
    imagesField.value = '';
  };


  var previewAvatar = function (files, labelDrop, fromDrop) {
    var avaFile = files[0];
    if (files.length === 0) {
      setDefaultAva();
    } else {
      if (/image.*/.test(avaFile.type)) {
        if (fromDrop) {
          window.avatarFile = avaFile;
        }
        imgAvatar.src = window.URL.createObjectURL(avaFile);
        imgAvatar.style.cssText = 'width: auto; height: auto; margin: 0;';
        labelDrop.innerHTML = messageDropImg.primary;
        window.map.setClassName(labelDrop, 'error', true);
        window.URL.revokeObjectURL(avaFile);
      } else {
        setDefaultAva();
        labelDrop.innerHTML = messageDropImg.error;
        window.map.setClassName(labelDrop, 'error', false);
      }
    }
  };


  var stopDefault = function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  };

  var dragEnter = function (evt) {
    stopDefault(evt);
    this.style.boxShadow = '0 0 10px 3px #ff5635';
  };

  function dragLeave(evt) {
    stopDefault(evt);
    this.style.boxShadow = '';
  }

  var drop = function (evt) {
    stopDefault(evt);
    var elmTarget = evt.target;
    var files = evt.dataTransfer.files;
    if (elmTarget === labelAvatarDrop) {
      previewAvatar(files, labelAvatarDrop, true);
    } else {
      previewPhoto(files, labelPhotoDrop, photoUploadContainer);
    }
    this.style.boxShadow = '';
  };

  labelAvatarDrop.addEventListener('dragenter', dragEnter, false);
  labelAvatarDrop.addEventListener('dragover', dragEnter, false);
  labelAvatarDrop.addEventListener('dragleave', dragLeave, false);
  labelAvatarDrop.addEventListener('drop', drop, false);

  labelPhotoDrop.addEventListener('dragenter', dragEnter, false);
  labelPhotoDrop.addEventListener('dragover', dragEnter, false);
  labelPhotoDrop.addEventListener('dragleave', dragLeave, false);
  labelPhotoDrop.addEventListener('drop', drop, false);



  /*----------------  Validate  ---------------------------------------*/
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


  var validate = function (evt) {
    var element = evt.target;

    if (element === inputTitle) {
      var msgErrTitle = 'Обязательое поле. Длина заголовка должна быть от 30 до 100 символов. Длина сейчас: ' + element.value.length;
      if (element.validity.tooShort || element.validity.tooLong || element.validity.valueMissing) {
        showError(element, msgErrTitle);
      } else {
        resetError(element);
      }
    }

    if (element === selectType) {
      changeMinPrice();
    }

    if (element === selectPrice) {
      var minPrice = element.getAttribute('min');
      var typeHome = selectType.options[selectType.selectedIndex].text;
      var msgErrPrice = typeHome + ': min = ' + minPrice + ', max = 1000000';
      if (element.validity.rangeOverflow || element.validity.rangeUnderflow || element.validity.valueMissing) {
        showError(element, msgErrPrice);
      } else {
        resetError(element);
      }
    }

    if (element === selectCapacity || element === selectRoomNumber) {
      changeCapacity();
      var roomsValue = selectRoomNumber.options[selectRoomNumber.selectedIndex].value;
      var capacityValue = selectCapacity.options[selectCapacity.selectedIndex].value;
      var msgErrCapacity = 'Кол-во гостей не соотвествует кол-ву комнат';

      if (((roomsValue === '0') && (capacityValue === '0')) ||
        ((roomsValue === '1') && (capacityValue === '1')) ||
        ((roomsValue === '2') && ((capacityValue === '1') || (capacityValue === '2'))) ||
        ((roomsValue === '3') && ((capacityValue === '1') || (capacityValue === '2') || (capacityValue === '3')))) {
        resetError(selectCapacity);
      } else {
        showError(selectCapacity, msgErrCapacity);
      }
    }

    if (element === selectTimeIn || element === selectTimeOut) {
      changeTime(element);
    }

    if (element === avatarField) {
      var avaFile = element.files;
      previewAvatar(avaFile, labelAvatarDrop);
    }

    if (element === imagesField) {
      var imgFile = element.files;
      previewPhoto(imgFile, labelPhotoDrop, photoUploadContainer);
    }

  };

  window.form = {
    setDefaultAva: setDefaultAva,
    setDefaultPhotoList: setDefaultPhotoList,
    validate: validate,
    adForm: adForm,
    arrPhotoFeatures: arrPhotoFeatures,
    avatarFile: avatarFile
  }

})();
