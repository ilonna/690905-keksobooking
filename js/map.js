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
  var listPins = templateNode('.map__pins');
  var pinElement = cloneNode('template', '.map__pin');
  var pinElementImg = pinElement.querySelector('img');
  pinElement.setAttribute('style', 'left:' + user.location.x + 'px; top: ' + user.location.y + 'px;');
  pinElementImg.src = user.author.avatar;
  pinElementImg.alt = user.offer.title;
  listPins.appendChild(pinElement);
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

var templateNode = function (selector) {
  return document.querySelector(selector);
};
var cloneNode = function (template, templateSelector) {
  return document.querySelector(template).content.querySelector(templateSelector).cloneNode(true);
};



createCards(USERS_COUNT);

var listCards = templateNode('.map');
var cardElement = cloneNode('template', '.map__card');

var featuresListTemplate = cardElement.querySelector('.popup__features');
var featuresList = featuresListTemplate.querySelectorAll('li');
getFeatures(USERS[0].offer.features, featuresList);

cardElement.querySelector('.popup__title').textContent = USERS[0].offer.title;
cardElement.querySelector('.popup__text--address').textContent = USERS[0].offer.address;
cardElement.querySelector('.popup__text--price').textContent = USERS[0].offer.price + '₽/ночь';
cardElement.querySelector('.popup__type').textContent = offerTypes[USERS[0].offer.type];
cardElement.querySelector('.popup__text--capacity').textContent = USERS[0].offer.rooms + ' комнаты для ' + USERS[0].offer.guests + ' гостей';
cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + USERS[0].offer.checkin + ', выезд до ' + USERS[0].offer.checkout;
cardElement.querySelector('.popup__description').textContent = USERS[0].offer.description;
cardElement.querySelector('.popup__photos').src = USERS[0].offer.photos;
cardElement.querySelector('.popup__avatar').src = USERS[0].author.avatar;

listCards.insertBefore(cardElement, listCards.lastChild);


console.log(USERS);
console.log(USERS[0].offer.features);
