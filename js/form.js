'use strict';

(function () {


  var selectTimeIn = adForm.querySelector('#timein');
  var selectTimeOut = adForm.querySelector('#timeout');
  var selectType = adForm.querySelector('#type');
  var selectPrice = adForm.querySelector('#price');
  var inputTitle = adForm.querySelector('#title');

  var selectRoomNumber = adForm.querySelector('#room_number');
  var selectCapacity = adForm.querySelector('#capacity');

  window.avaUploadContainer = adForm.querySelector('.ad-form-header__upload');
  var avaPreviewContainer = avaUploadContainer.querySelector('.ad-form-header__preview');
  window.labelAvatarDrop = avaUploadContainer.querySelector('.ad-form-header__drop-zone');
  var imgAvatar = avaPreviewContainer.querySelector('img');

  window.photoUploadContainer = adForm.querySelector('.ad-form__photo-container');
  var photoPreviewContainer = photoUploadContainer.querySelector('.ad-form__photo');
  window.labelPhotoDrop = photoUploadContainer.querySelector('.ad-form__drop-zone');

  var arrPhotoFeatures = [];


  /* --- Связь между временем заезда/выезда  ------------------*/
  var changeTime = function (select) {
    var indexSelectOption = select.selectedIndex;
    if (select === selectTimeIn) {
      selectTimeOut.options[indexSelectOption].selected = true;
    } else {
      selectTimeIn.options[indexSelectOption].selected = true;
    }
  };


  /* --- Связь между типом жилья и ценой  ------------------*/
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

  /* --- Связь между кол-ом комнат и кол-ом гостей  ------------------*/
  var changeCapacity = function () {
    var selectRoomIndex = selectRoomNumber.selectedIndex;
    var selectRoomValue = selectRoomNumber.options[selectRoomIndex].getAttribute('value');
    var selectCapacityOptions = selectCapacity.options;

    for (var k = 0; k < selectRoomNumber.length; k++) {
      selectCapacity.options[k].disabled = true;
    }

    var selArray = Array.from(selectCapacityOptions).filter(function (el, index) {
      if (selectRoomValue === '0' || selectRoomValue === '1') {
        return el.value === selectRoomValue;
      } else if (selectRoomValue === '2') {
        return el.value <= selectRoomValue && el.value !== '0';
      } else {
        return el.value <= selectRoomValue && el.value !== '0';
      }
    });

    for (var i = 0; i < selArray.length; i++) {
      selectCapacity.options[selArray[i].index].disabled = false;
    }

  };


  /*----------------  Validate  ---------------------------------------*/
  var showError = function (element, errorMessage) {
    var container = element.parentNode;
    resetError(element);
    var msgElement = document.createElement('div');
    msgElement.className = 'error-message';
    msgElement.innerHTML = errorMessage;
    element.setCustomValidity(errorMessage);
    element.classList.add('error');
    container.appendChild(msgElement);

  };

  var resetError = function (element) {
    var container = element.parentNode;
    if (container.lastChild.className === 'error-message') {
      container.removeChild(container.lastChild);
      element.setCustomValidity('');
      element.classList.remove('error');
    }
  };


  window.validateForm = function (evt) {
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

  };


  /*--------- Загрузка/предпоказ изображений (В ПРОЦЕССЕ) --------------------*/
  window.previewPhoto = function (files, labelDrop, photoContainer) {
    var photoFile;
    for (var i = 0; i < files.length; i++) {
      photoFile = files[i];
      if (/image.*/.test(photoFile.type)) {
        arrPhotoFeatures.push(photoFile);
        var photoTemplate = photoPreviewContainer.cloneNode(true);
        var imgPhoto = document.createElement('img');
        imgPhoto.src = window.URL.createObjectURL(photoFile);
        labelDrop.innerHTML = 'Загрузите или&nbsp;перетащите сюда фото';
        setClassName(labelDrop, 'error', true);
        photoTemplate.appendChild(imgPhoto);
        if (photoPreviewContainer.childNodes.length === 0) {
          photoPreviewContainer.remove();
        }
        photoContainer.appendChild(photoTemplate);
        window.URL.revokeObjectURL(photoFile);
      } else {
        labelDrop.innerHTML = 'Файл не является изображением';
        setClassName(labelDrop, 'error', false);

      }
    }
  };


  window.previewAvatar = function (files, labelDrop) {
    var avaFile = files[0];
    if (files.length === 0) {
      labelDrop.innerHTML = 'Загрузите или&nbsp;перетащите сюда фото';
      imgAvatar.src = 'img/muffin-grey.svg';
      imgAvatar.style.cssText = '';
    } else {
      if (/image.*/.test(avaFile.type)) {
        imgAvatar.src = window.URL.createObjectURL(avaFile);
        imgAvatar.style.cssText = 'width: auto; height: auto; margin: 0;';
        labelDrop.innerHTML = 'Загрузите или&nbsp;перетащите сюда фото';
        setClassName(labelDrop, 'error', true);
        window.URL.revokeObjectURL(avaFile);
      } else {
        labelDrop.innerHTML = 'Файл не является изображением';
        setClassName(labelDrop, 'error', false);
        imgAvatar.src = 'img/muffin-grey.svg';
        imgAvatar.style.cssText = '';
      }
    }
  };


  function stopDefault(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function dragEnter(evt) {
    stopDefault(evt);
    this.style.boxShadow = '0 0 10px 3px #ff5635';
  }

  function dragLeave(evt) {
    stopDefault(evt);
    this.style.boxShadow = '';
  }

  function drop(evt) {
    stopDefault(evt);
    var elmTarget = evt.target;
    var files = evt.dataTransfer.files;
    if (elmTarget === labelAvatarDrop) {
      previewAvatar(files, labelAvatarDrop);
    } else {
      previewPhoto(files, labelPhotoDrop, photoUploadContainer);
    }
    this.style.boxShadow = '';
  }

  labelAvatarDrop.addEventListener('dragenter', dragEnter, false);
  labelAvatarDrop.addEventListener('dragover', dragEnter, false);
  labelAvatarDrop.addEventListener('dragleave', dragLeave, false);
  labelAvatarDrop.addEventListener('drop', drop, false);

  labelPhotoDrop.addEventListener('dragenter', dragEnter, false);
  labelPhotoDrop.addEventListener('dragover', dragEnter, false);
  labelPhotoDrop.addEventListener('dragleave', dragLeave, false);
  labelPhotoDrop.addEventListener('drop', drop, false);

})();
