'use strict';

var OFFERS_COUNT = 8;
var PIN_WIDTH = 50;
var PIN_HEIGTH = 70;
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKIN = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUT = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var TEMPLATE = document.querySelector('template');
var CONTAINER = document.querySelector('.map');
var CARDS_TEMPLATE = TEMPLATE.content.querySelector('.map__card');
var CARD_ELEMENT = CARDS_TEMPLATE.cloneNode(true);
var POPUP_CLOSE = CARD_ELEMENT.querySelector('.popup__close');
var PINS_CONTAINER = CONTAINER.querySelector('.map__pins');
var PIN_TEMPLATE = TEMPLATE.content.querySelector('.map__pin');
var FEATURES_CONTAINER = CARD_ELEMENT.querySelector('.popup__features');
var FEATURES_ELEMENTS = FEATURES_CONTAINER.querySelectorAll('li');
var FEATURES_PHOTO_CONTAINER = CARD_ELEMENT.querySelector('.popup__photos');
var PHOTO_OFFER_TEMPLATE = FEATURES_PHOTO_CONTAINER.querySelector('img');
FEATURES_PHOTO_CONTAINER.removeChild(PHOTO_OFFER_TEMPLATE);



var OFFERS = [];
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
  pinElement.addEventListener('click', function () {
    generateOffers(offer);
  });
  var pinElementImg = pinElement.querySelector('img');
  pinElement.setAttribute('style', 'left:' + offer.location.x + 'px; top: ' + offer.location.y + 'px;');
  pinElementImg.src = offer.author.avatar;
  pinElementImg.alt = offer.offer.title;
  PINS_CONTAINER.appendChild(pinElement);
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


var generatePhotoOffers = function (offer) {
  FEATURES_PHOTO_CONTAINER.innerHTML = '';
  for (var k = 0; k < offer.offer.photos.length; k++) {
    var imgElement = PHOTO_OFFER_TEMPLATE.cloneNode(true);
    imgElement.src = offer.offer.photos[k];
    FEATURES_PHOTO_CONTAINER.appendChild(imgElement);
  }
};

var getFeatures = function (array) {
  FEATURES_CONTAINER.innerHTML = '';
  for (var l = 0; l < array.length; l++) {
    var li = document.createElement('li');
    li.className = 'popup__feature popup__feature--' + array[l];
    FEATURES_CONTAINER.appendChild(li);
  }
};

var generateOffers = function (offer) {
  getFeatures(offer.offer.features);
  CARD_ELEMENT.querySelector('.popup__title').textContent = offer.offer.title;
  CARD_ELEMENT.querySelector('.popup__text--address').textContent = offer.offer.address;
  CARD_ELEMENT.querySelector('.popup__text--price').textContent = offer.offer.price + '₽/ночь';
  CARD_ELEMENT.querySelector('.popup__type').textContent = offerTypes[offer.offer.type];
  CARD_ELEMENT.querySelector('.popup__text--capacity').textContent = offer.offer.rooms + ' комнаты для ' + offer.offer.guests + ' гостей';
  CARD_ELEMENT.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
  CARD_ELEMENT.querySelector('.popup__description').textContent = offer.offer.description;
  CARD_ELEMENT.querySelector('.popup__avatar').src = offer.author.avatar;
  generatePhotoOffers(offer);

  CONTAINER.insertBefore(CARD_ELEMENT, CONTAINER.lastElementChild);
};


/* ------- EVENT   module4-task1 ------------------------*/

var PIN_MAIN_ELEMENT = PINS_CONTAINER.querySelector('.map__pin--main');
var FORM_CONTAINER = document.querySelector('.ad-form');
var FIELDSET_ELEMENT = FORM_CONTAINER.querySelectorAll('fieldset');
var ADDRESS_FIELD = FORM_CONTAINER.querySelector('#address');

var disabledFormElements = function (selector) {
  selector.forEach(function (element) {
    element.setAttribute('disabled', true);
  });
};

var enabledFormElements = function (selector) {
  selector.forEach(function (element) {
    element.removeAttribute('disabled', true);
  });
};

var removeClass = function (selector, className) {
  selector.classList.remove(className);
};

var pageActivation = function () {
  removeClass(CONTAINER, 'map--faded');
  removeClass(FORM_CONTAINER, 'ad-form--disabled');
  enabledFormElements(FIELDSET_ELEMENT);
  createCards(OFFERS_COUNT);
  fillAdressField();

  PIN_MAIN_ELEMENT.removeEventListener('mouseup', pageActivation);
};

disabledFormElements(FIELDSET_ELEMENT);

PIN_MAIN_ELEMENT.addEventListener('mouseup', pageActivation);

POPUP_CLOSE.addEventListener('click', function () {
  CARD_ELEMENT.remove();
});


var fillAdressField = function () {
  var pinH = parseInt(getComputedStyle(PIN_MAIN_ELEMENT).height, 10) / 2;
  var pinW = parseInt(getComputedStyle(PIN_MAIN_ELEMENT).width, 10) / 2;
  var pinL = parseInt(getComputedStyle(PIN_MAIN_ELEMENT).left, 10);
  var pinT = parseInt(getComputedStyle(PIN_MAIN_ELEMENT).top, 10);
  var posL = Math.round(pinL + pinW);
  var posT = Math.round(pinT + pinH);
  var fillAdress = posL + ', ' + posT;
  ADDRESS_FIELD.setAttribute('value', fillAdress);
};
