'use strict';

var USERS_COUNT = 8;
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

var WRAPPER = document.querySelector('.map');
var CARDS_TEMPLATE = document.querySelector('template').content.querySelector('.map__card');
var CARD_ELEMENT = CARDS_TEMPLATE.cloneNode(true);
var WRAP_PINS = WRAPPER.querySelector('.map__pins');
var PINS_TEMPLATE = document.querySelector('template').content.querySelector('.map__pin');
var WRAP_FEATURES = CARD_ELEMENT.querySelector('.popup__features');
var FEATURES_ELEMENTS = WRAP_FEATURES.querySelectorAll('li');



var USERS = [];
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
    }
    else {
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

var createUser = function (title, type, checkin, checkout, features, photos, avatar) {
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
  var pinElement = PINS_TEMPLATE.cloneNode(true);
  var pinElementImg = pinElement.querySelector('img');
  pinElement.setAttribute('style', 'left:' + user.location.x + 'px; top: ' + user.location.y + 'px;');
  pinElementImg.src = user.author.avatar;
  pinElementImg.alt = user.offer.title;
  WRAP_PINS.appendChild(pinElement);
};


var createCards = function (count) {
  var getRandomTitle = elementGetter(OFFER_TITLES);
  var getRandomType = elementGetter(OFFER_TYPES);
  var getRandomCheckin = elementGetter(OFFER_CHECKIN);
  var getRandomCheckout = elementGetter(OFFER_CHECKOUT);
  var getRandomFeatures = elementGetter(OFFER_FEATURES, true);
  var getRandomPhotos = elementGetter(OFFER_PHOTOS);
  var getRandomAvatar = elementGetter(createArray(1, 8));

  for (var i = 0; i < count; i++) {
    var user = createUser(
      getRandomTitle(),
      getRandomType(),
      getRandomCheckin(),
      getRandomCheckout(),
      getRandomFeatures(),
      getRandomPhotos(),
      getRandomAvatar()
    );
    createPin(user);
    USERS.push(user);
  }
};

var generateCard = function (user) {
  getFeatures(user.offer.features, FEATURES_ELEMENTS);
  CARD_ELEMENT.querySelector('.popup__title').textContent = user.offer.title;
  CARD_ELEMENT.querySelector('.popup__text--address').textContent = user.offer.address;
  CARD_ELEMENT.querySelector('.popup__text--price').textContent = user.offer.price + '₽/ночь';
  CARD_ELEMENT.querySelector('.popup__type').textContent = offerTypes[user.offer.type];
  CARD_ELEMENT.querySelector('.popup__text--capacity').textContent = user.offer.rooms + ' комнаты для ' + user.offer.guests + ' гостей';
  CARD_ELEMENT.querySelector('.popup__text--time').textContent = 'Заезд после ' + user.offer.checkin + ', выезд до ' + user.offer.checkout;
  CARD_ELEMENT.querySelector('.popup__description').textContent = user.offer.description;
  CARD_ELEMENT.querySelector('.popup__photos').src = user.offer.photos;
  CARD_ELEMENT.querySelector('.popup__avatar').src = user.author.avatar;

  WRAPPER.insertBefore(CARD_ELEMENT, WRAPPER.lastElementChild);
};

createCards(USERS_COUNT);
generateCard(USERS[0]);
