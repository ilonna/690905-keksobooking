'use strict';

var OFFERS_COUNT = 8;
var PIN_WIDTH = 50;
var PIN_HEIGTH = 70;
var PIN_DEFAULT_TOP = 375;
var PIN_DEFAULT_LEFT = 570;
var ESC_KEYCODE = 27;
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKIN = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUT = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var OFFERS = [];

var TEMPLATE = document.querySelector('template');
var CARDS_TEMPLATE = TEMPLATE.content.querySelector('.map__card');
var PIN_TEMPLATE = TEMPLATE.content.querySelector('.map__pin');

var container = document.querySelector('.map');
var pinsContainer = container.querySelector('.map__pins');


var cardContainer = CARDS_TEMPLATE.cloneNode(true);
var buttonClosePopup = cardContainer.querySelector('.popup__close');

var featuresContainer = cardContainer.querySelector('.popup__features');
var photoFeaturesContainer = cardContainer.querySelector('.popup__photos');
var photoFeatures = photoFeaturesContainer.querySelector('img');
photoFeaturesContainer.removeChild(photoFeatures);

var adForm = document.querySelector('.ad-form');
var pinMainElement = pinsContainer.querySelector('.map__pin--main');
var imgPinElement = pinMainElement.querySelector('img');
var fieldsetElements = adForm.querySelectorAll('fieldset');
var inputAddress = adForm.querySelector('#address');
var selectTimeIn = adForm.querySelector('#timein');
var selectTimeOut = adForm.querySelector('#timeout');
var selectType = adForm.querySelector('#type');
var selectPrice = adForm.querySelector('#price');
var sendButton = adForm.querySelector('.ad-form__submit');
var resetButton = adForm.querySelector('.ad-form__reset');
var inputTitle = adForm.querySelector('#title');
var successForm = document.querySelector('.success');



var offerTypes = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};


var createArray = function (min, max) {
  return Array(max - min + 1).fill(min).map(function (item, index) {
    return item + index;
  });
};

var elementGetter = function (array, randomLength) {
  var data = array.slice(0);
  return function () {
    if (data.length === 0) {
      data = array.slice(0);
    }
    var index = getRandomIndex(data);
    if (randomLength) {
      return data.slice(0, index);
    } else {
      return data.splice(index, 1).pop();
    }
  };
};

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
};

var getRandomIndex = function (array) {
  return Math.floor(Math.random() * array.length);
};


var createOffer = function (title, type, checkin, checkout, features, photos, avatar) {
  var randomOfferPrice = getRandomNumber(1000, 1000000);
  var randomOfferRooms = getRandomNumber(1, 5);
  var randomOfferGuests = getRandomNumber(1, 10);
  var randomLocationX = getRandomNumber(300, 900);
  var randomLocationY = getRandomNumber(150, 500);

  return {
    'author': {
      'avatar': 'img/avatars/user0' + avatar + '.png'
    },
    'location': {
      'x': randomLocationX - PIN_WIDTH / 2,
      'y': randomLocationY - PIN_HEIGTH
    },
    'offer': {
      'title': title,
      'address': randomLocationX + ', ' + randomLocationY,
      'price': randomOfferPrice,
      'type': type,
      'rooms': randomOfferRooms,
      'guests': randomOfferGuests,
      'checkin': checkin,
      'checkout': checkout,
      'features': features,
      'description': '',
      'photos': photos
    }
  };
};



var createPin = function (offer) {
  var pinElement = PIN_TEMPLATE.cloneNode(true);
  var pinElementImg = pinElement.querySelector('img');
  pinElement.setAttribute('style', 'left:' + offer.location.x + 'px; top: ' + offer.location.y + 'px;');
  pinElementImg.src = offer.author.avatar;
  pinElementImg.alt = offer.offer.title;
  pinsContainer.appendChild(pinElement);
  pinElement.addEventListener('click', function () {
    generateOffers(offer);
    buttonClosePopup.addEventListener('click', removeCard);
    document.addEventListener('keydown', onPopupEscPress);
  });
};

var createCards = function (count) {
  var getRandomTitle = elementGetter(OFFER_TITLES);
  var getRandomType = elementGetter(OFFER_TYPES);
  var getRandomCheckin = elementGetter(OFFER_CHECKIN);
  var getRandomCheckout = elementGetter(OFFER_CHECKOUT);
  var getRandomFeatures = elementGetter(OFFER_FEATURES, true);
  var getRandomAvatar = elementGetter(createArray(1, 8));

  for (var i = 0; i < count; i++) {
    var offer = createOffer(
        getRandomTitle(),
        getRandomType(),
        getRandomCheckin(),
        getRandomCheckout(),
        getRandomFeatures(),
        OFFER_PHOTOS,
        getRandomAvatar()
    );
    createPin(offer);
    OFFERS.push(offer);
  }
};


var getPhotoOffers = function (offer) {
  photoFeaturesContainer.innerHTML = '';
  offer.offer.photos.forEach(function(element) {
    var imgElement = photoFeatures.cloneNode(true);
    imgElement.src = element;
    photoFeaturesContainer.appendChild(imgElement);
  });
};

var getFeatures = function (array) {
  featuresContainer.innerHTML = '';
  array.forEach(function(element) {
    var li = document.createElement('li');
    li.className = 'popup__feature popup__feature--' + element;
    featuresContainer.appendChild(li);
  });
};

var generateOffers = function (offer) {
  cardContainer.querySelector('.popup__title').textContent = offer.offer.title;
  cardContainer.querySelector('.popup__text--address').textContent = offer.offer.address;
  cardContainer.querySelector('.popup__text--price').textContent = offer.offer.price + '₽/ночь';
  cardContainer.querySelector('.popup__type').textContent = offerTypes[offer.offer.type];
  cardContainer.querySelector('.popup__text--capacity').textContent = offer.offer.rooms + ' комнаты для ' + offer.offer.guests + ' гостей';
  cardContainer.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
  cardContainer.querySelector('.popup__description').textContent = offer.offer.description;
  cardContainer.querySelector('.popup__avatar').src = offer.author.avatar;
  getFeatures(offer.offer.features);
  getPhotoOffers(offer);

  container.insertBefore(cardContainer, container.lastElementChild);
};


var removeCard = function () {
  cardContainer.remove();
};
var onPopupEscPress = function(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeCard();
  }
};

var setAttributeFormElements = function (selector, status) {
  selector.forEach(function (element) {
    if (status) {
      element.removeAttribute('disabled', true);
    } else {
      element.setAttribute('disabled', true);
    }
  });
};

var setClassName = function (selector, className, status) {
  if (status) {
    selector.classList.remove(className);
  } else {
    selector.classList.add(className);
  }
};

var setCoordDotMap = function (endX, endY) {
  var dot = {
    top: endY + (imgPinElement.offsetHeight + parseInt(getComputedStyle(pinMainElement, '::after').height, 10)),
    left: endX + Math.round(parseInt(getComputedStyle(pinMainElement).width, 10) / 2)
  };
  inputAddress.setAttribute('value', dot.left + ', ' + dot.top);
};


/* --- Связь между временем заезда/выезда  ------------------*/
var changeTime = function () {
  var select = this.selectedIndex;
  if (this === selectTimeIn) {
    selectTimeOut.options[select].selected=true;
  } else {
    selectTimeIn.options[select].selected=true;
  }
};


/* --- Связь между типом жилья и ценой  ------------------*/
var changeMinPrice = function () {
  var selectType = this.options[this.selectedIndex].getAttribute('value');
  var inputVal = selectPrice.value;
  switch (selectType) {
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
var selectRoomNumber = adForm.querySelector('#room_number');
var selectCapacity = adForm.querySelector('#capacity');

var changeCapacity = function () {
  var selectRoomIndex = selectRoomNumber.selectedIndex;
  var selectRoomValue = selectRoomNumber.options[selectRoomIndex].getAttribute('value');
  var selectCapacityOptions = selectCapacity.options;

  for (var k = 0; k < selectRoomNumber.length; k++) {
    selectCapacity.options[k].disabled = true;
  }

  var selArray = Array.from(selectCapacityOptions).filter(function(el, index) {
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


/* ------- drag&drop -----------------------*/
pinMainElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var limitCoords = {
    top: pinsContainer.offsetTop,
    right: pinsContainer.offsetWidth - pinMainElement.offsetWidth,
    bottom: pinsContainer.offsetHeight -  imgPinElement.offsetHeight - parseInt(getComputedStyle(pinMainElement, '::after').height, 10),
    left: pinsContainer.offsetLeft
  };

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  var onMouseLeave = function (leaveEvt) {
    leaveEvt.preventDefault();
    onMouseUp(leaveEvt);
    pinsContainer.removeEventListener('mouseleave', onMouseLeave);
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var endCoords = {
      x: pinMainElement.offsetLeft - shift.x,
      y: pinMainElement.offsetTop - shift.y
    };

    if (endCoords.x > limitCoords.right) {
      endCoords.x = limitCoords.right;
    }
    if (endCoords.x < limitCoords.left) {
      endCoords.x = limitCoords.left;
    }
    if (endCoords.y > limitCoords.bottom) {
      endCoords.y = limitCoords.bottom;
    }
    if (endCoords.y < limitCoords.top) {
      endCoords.y = limitCoords.top;
    }

    pinMainElement.style.left = endCoords.x + 'px';
    pinMainElement.style.top = endCoords.y + 'px';

    setCoordDotMap(endCoords.x, endCoords.y);

    pinsContainer.addEventListener('mouseleave', onMouseLeave);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});



/*----------------  Validate  ---------------------------------------*/
var showError = function(element, errorMessage) {
  var container = element.parentNode;
  resetError(element);
  var msgElement = document.createElement('div');
  msgElement.className = 'error-message';
  msgElement.innerHTML = errorMessage;
  element.setCustomValidity(errorMessage);
  element.classList.add('error');
  container.appendChild(msgElement);

};

var resetError = function(element) {
  var container = element.parentNode;
  if (container.lastChild.className === 'error-message') {
    container.removeChild(container.lastChild);
    element.setCustomValidity('');
    element.classList.remove('error');
  }
};

var validTitle = false;
var validPrice = false;
var validCapacity = false;

var validateForm = function(evt) {
  var element = evt.target;


  if (element === inputTitle) {
    var msgErrTitle = 'Обязательое поле. Длина заголовка должна быть от 30 до 100 символов. Длина сейчас: ' + element.value.length;
    if (element.validity.tooShort || element.validity.tooLong || element.validity.valueMissing) {
      showError(element, msgErrTitle);
    } else {
      resetError(element);
      validTitle = true;
    }
  }

  if (element === selectPrice) {
    var minPrice = element.getAttribute('min');
    var typeHome = selectType.options[selectType.selectedIndex].text;
    var msgErrPrice = typeHome + ': min = ' + minPrice + ', max = 1000000';
    if (element.validity.rangeOverflow || element.validity.rangeUnderflow || element.validity.valueMissing) {
      showError(element, msgErrPrice);
    } else {
      resetError(element);
      validPrice = true;
    }
  }

  if (element === selectCapacity || element === selectRoomNumber) {
    var roomsValue = selectRoomNumber.options[selectRoomNumber.selectedIndex].value;
    var capacityValue = selectCapacity.options[selectCapacity.selectedIndex].value;
    var msgErrCapacity = 'Кол-во гостей не соотвествует кол-ву комнат';

    if (((roomsValue === '0') && (capacityValue === '0')) ||
      ((roomsValue === '1') && (capacityValue === '1')) ||
      ((roomsValue === '2') && ((capacityValue === '1') || (capacityValue === '2'))) ||
      ((roomsValue === '3') && ((capacityValue === '1') || (capacityValue === '2') || (capacityValue === '3'))))
    {
      resetError(selectCapacity);
      validCapacity = true;
    } else {
      showError(selectCapacity, msgErrCapacity);
    }
  }

};

var sendForm = function (evt) {
/*  successForm.classList.remove('hidden');
  setTimeout(successForm.classList.add('hidden'), 4000);*/
};





var setStatusPage = function (status) {
  pinsContainer.querySelectorAll('.map__pin').forEach(function (element) {
    setClassName(element, 'hidden', status);
  });
  setClassName(container, 'map--faded', status);
  setClassName(adForm, 'ad-form--disabled', status);
  setAttributeFormElements(fieldsetElements, status);
};

var setDefaultPage = function () {
  setStatusPage(false);
  adForm.reset();
  removeCard();
  pinMainElement.setAttribute('style', 'left: ' + PIN_DEFAULT_LEFT + 'px; top: ' + PIN_DEFAULT_TOP + 'px;');
  pinMainElement.addEventListener('mouseup', activatePage);
  successForm.classList.add('hidden');
};

var activatePage = function () {
  setStatusPage(true);
  setCoordDotMap(parseInt(getComputedStyle(pinMainElement).left, 10), parseInt(getComputedStyle(pinMainElement).top, 10));
  resetButton.addEventListener('click', setDefaultPage);
  pinMainElement.removeEventListener('mouseup', activatePage);
  selectType.addEventListener('change', changeMinPrice);
  selectTimeIn.addEventListener('change', changeTime);
  selectTimeOut.addEventListener('change', changeTime);
  selectRoomNumber.addEventListener('change', changeCapacity);

  adForm.addEventListener('change', validateForm);
/*  adForm.addEventListener('invalid', validateForm);*/
  sendButton.addEventListener('click', sendForm);

};

createCards(OFFERS_COUNT);
setDefaultPage();






/*--------- Загрузка/предпоказ изображений (В ПРОЦЕССЕ) --------------------*/
var avaUploadContainer = adForm.querySelector('.ad-form-header__upload');
var avaContainer = avaUploadContainer.querySelector('.ad-form-header__preview');
var imgAvaDefault = avaUploadContainer.querySelector('.img_default');
var labelAva = avaUploadContainer.querySelector('.ad-form-header__drop-zone');

var photoUploadContainer = adForm.querySelector('.ad-form__photo-container');
var labelPhoto = photoUploadContainer.querySelector('.ad-form__drop-zone');
var photoContainer = photoUploadContainer.querySelector('.ad-form__photo');
var inp = photoUploadContainer.querySelector('.ad-form__input');



var preloadImg = function (files, photoLabel, photoContainer) {
  var file;
  for(var i = 0; i < files.length; i++) {
    file = files[i];
    if(/image.*/.test(file.type)) {
      var img = document.createElement('img');
      img.src = window.URL.createObjectURL(file);
      img.style.cssText = "width: auto; height: auto; margin: 0;";

      img.onload = function() {
        window.URL.revokeObjectURL(this.src);
        photoLabel.innerHTML = 'Загрузите или&nbsp;перетащите сюда фото';
        setClassName(photoLabel, 'error', true);
        setClassName(imgAvaDefault, 'hidden', false);
        photoContainer.appendChild(img);
      };
    } else {
      photoLabel.innerHTML = 'Файл не является изображением';
      setClassName(photoLabel, 'error', false);
      setClassName(imgAvaDefault, 'hidden', true);
    }
  }
};

function drop(evt) {
  evt.preventDefault();
  var elmTarget = evt.target;
  var files = evt.dataTransfer.files;
  if (elmTarget === labelAva) {
    preloadImg(files, labelAva, avaContainer);
  } else {
    preloadImg(files, labelPhoto, photoContainer);
  }
  this.style.boxShadow = '';
}
function dragLeave(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  this.style.boxShadow = '';
}
function dragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  this.style.boxShadow = '0 0 10px 3px #ff5635';
}
labelAva.addEventListener('dragleave', dragLeave, false);
labelAva.addEventListener('dragover', dragOver, false);
labelAva.addEventListener('drop', drop, false);


labelPhoto.addEventListener('dragleave', dragLeave, false);
labelPhoto.addEventListener('dragover', dragOver, false);
labelPhoto.addEventListener('drop', drop, false);

