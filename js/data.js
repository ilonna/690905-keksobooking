'use strict';

(function () {
  'use strict';

  var PIN_WIDTH = 50;
  var PIN_HEIGTH = 70;
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

  window.TEMPLATE = document.querySelector('template');
  window.PIN_TEMPLATE = TEMPLATE.content.querySelector('.map__pin');

  window.container = document.querySelector('.map');
  window.pinsContainer = container.querySelector('.map__pins');


  window.CARD_TEMPLATE = TEMPLATE.content.querySelector('.map__card');

  window.cardContainer = CARD_TEMPLATE.cloneNode(true);

  window.adForm = document.querySelector('.ad-form');


  window.offerTypes = {
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


  window.createCards = function (count) {
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


})();
