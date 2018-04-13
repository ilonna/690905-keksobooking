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
var OFFER_FEATURES = ['wi-fi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var CONTAINER = document.querySelector('.map');
var CARDS_TEMPLATE = document.querySelector('template').content.querySelector('.map__card');
var CARD_ELEMENT = CARDS_TEMPLATE.cloneNode(true);
var PINS_CONTAINER = CONTAINER.querySelector('.map__pins');
var PIN_TEMPLATE = document.querySelector('template').content.querySelector('.map__pin');
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


document.querySelector('.map').classList.remove('map--faded');

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
      return data.slice(1, index);
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


var getFeatures = function (array, list) {
  for (var j = 0, len = list.length; j < len; j++) {
    var exists = false;
    for (var k = 0; k < array.length; k++) {
      if (list[j].matches('.popup__feature--' + array[k])) {
        exists = true;
      }
    }
    if (!exists) {
      list[j].remove();
    }
  }
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

var createPin = function (user) {
  var pinElement = PIN_TEMPLATE.cloneNode(true);
  var pinElementImg = pinElement.querySelector('img');
  pinElement.setAttribute('style', 'left:' + user.location.x + 'px; top: ' + user.location.y + 'px;');
  pinElementImg.src = user.author.avatar;
  pinElementImg.alt = user.offer.title;
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


var generatePhotoOffers = function (id) {
  for (var k = 0; k < OFFERS[id].offer.photos.length; k++) {
    var imgElement = PHOTO_OFFER_TEMPLATE.cloneNode(true);
    imgElement.src = OFFERS[id].offer.photos[k];
    FEATURES_PHOTO_CONTAINER.appendChild(imgElement);
  }
};

var generateOffers = function (id) {
  getFeatures(OFFERS[id].offer.features, FEATURES_ELEMENTS);
  CARD_ELEMENT.querySelector('.popup__title').textContent = OFFERS[id].offer.title;
  CARD_ELEMENT.querySelector('.popup__text--address').textContent = OFFERS[id].offer.address;
  CARD_ELEMENT.querySelector('.popup__text--price').textContent = OFFERS[id].offer.price + '₽/ночь';
  CARD_ELEMENT.querySelector('.popup__type').textContent = offerTypes[OFFERS[id].offer.type];
  CARD_ELEMENT.querySelector('.popup__text--capacity').textContent = OFFERS[id].offer.rooms + ' комнаты для ' + OFFERS[id].offer.guests + ' гостей';
  CARD_ELEMENT.querySelector('.popup__text--time').textContent = 'Заезд после ' + OFFERS[id].offer.checkin + ', выезд до ' + OFFERS[id].offer.checkout;
  CARD_ELEMENT.querySelector('.popup__description').textContent = OFFERS[id].offer.description;
  CARD_ELEMENT.querySelector('.popup__avatar').src = OFFERS[id].author.avatar;

  generatePhotoOffers(id);

  CONTAINER.insertBefore(CARD_ELEMENT, CONTAINER.lastElementChild);
};

createCards(OFFERS_COUNT);
generateOffers(0);
