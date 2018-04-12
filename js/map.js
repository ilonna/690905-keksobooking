'use strict';

var USERS_COUNT = 8;
var PIN_WIDTH = 50;
var PIN_HEIGTH = 70;
var OFFER_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKIN = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUT = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wi-fi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var USERS = [];
var offerType = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};


document.querySelector('.map').classList.remove('map--faded');


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

var pinLocationGetter = function (posX, posY) {
  var pinX = posX - PIN_WIDTH / 2;
  var pinY = posY - PIN_HEIGTH;
  return {
    x: pinX,
    y: pinY
  };
};

var featuresGetter = function (array, template) {
  var list = template.querySelectorAll('li');
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


var getRandomOfferTitle = elementGetter(OFFER_TITLE);
var getRandomOfferType = elementGetter(OFFER_TYPE);
var getRandomOfferCheckin = elementGetter(OFFER_CHECKIN);
var getRandomOfferCheckout = elementGetter(OFFER_CHECKOUT);
var getRandomOfferFeatures = elementGetter(OFFER_FEATURES, true);
var getRandomOfferPhotos = elementGetter(OFFER_PHOTOS);

var listPins = document.querySelector('.map__pins');
var similarPinsTemplate = document.querySelector('template').content.querySelector('.map__pin');


for (var i = 0; i < USERS_COUNT; i++) {

  var randomAuthorAvatar = getRandomNumber(1, 8);
  var randomOfferPrice = getRandomNumber(1000, 1000000);
  var randomOfferRooms = getRandomNumber(1, 5);
  var randomOfferGuests = getRandomNumber(1, 10);
  var randomLocationX = getRandomNumber(300, 900);
  var randomLocationY = getRandomNumber(150, 500);

  USERS.push({
    'author': {
      'avatar': 'img/avatars/user0' + randomAuthorAvatar + '.png'
    },
    'location': {
      'x': randomLocationX,
      'y': randomLocationY
    },
    'offer': {
      'title': getRandomOfferTitle(),
      'address': randomLocationX + ', ' + randomLocationY,
      'price': randomOfferPrice,
      'type': getRandomOfferType(),
      'rooms': randomOfferRooms,
      'guests': randomOfferGuests,
      'checkin': getRandomOfferCheckin(),
      'checkout': getRandomOfferCheckout(),
      'features': getRandomOfferFeatures(),
      'description': '',
      'photos': getRandomOfferPhotos()
    }
  });

  var pinElement = similarPinsTemplate.cloneNode(true);
  var pinElementImg = pinElement.querySelector('img');
  var pinLocation = pinLocationGetter(USERS[i].location.x, USERS[i].location.y);
  pinElement.setAttribute('style', 'left:' + pinLocation.x + 'px; top: ' + pinLocation.y + 'px;');
  pinElementImg.src = USERS[i].author.avatar;
  pinElementImg.alt = USERS[i].offer.title;
  listPins.appendChild(pinElement);
}


var listCards = document.querySelector('.map');
var similarCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var cardElement = similarCardTemplate.cloneNode(true);

var featuresListTemplate = cardElement.querySelector('.popup__features');
featuresGetter(USERS[0].offer.features, featuresListTemplate);

cardElement.querySelector('.popup__title').textContent = USERS[0].offer.title;
cardElement.querySelector('.popup__text--address').textContent = USERS[0].offer.address;
cardElement.querySelector('.popup__text--price').textContent = USERS[0].offer.price + '₽/ночь';
cardElement.querySelector('.popup__type').textContent = offerType[USERS[0].offer.type];
cardElement.querySelector('.popup__text--capacity').textContent = USERS[0].offer.rooms + ' комнаты для ' + USERS[0].offer.guests + ' гостей';
cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + USERS[0].offer.checkin + ', выезд до ' + USERS[0].offer.checkout;
cardElement.querySelector('.popup__description').textContent = USERS[0].offer.description;
cardElement.querySelector('.popup__photos').src = USERS[0].offer.photos;
cardElement.querySelector('.popup__avatar').src = USERS[0].author.avatar;

listCards.insertBefore(cardElement, listCards.lastChild);


console.log(USERS);
console.log(USERS[0].offer.features);
