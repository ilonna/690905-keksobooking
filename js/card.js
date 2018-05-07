'use strict';

(function () {

  var templateLayout = document.querySelector('template');
  var mapContainer = document.querySelector('.map');
  var cardTemplate = templateLayout.content.querySelector('.map__card');
  var cardContainer = cardTemplate.cloneNode(true);
  var featuresContainer = cardContainer.querySelector('.popup__features');
  var photoFeaturesContainer = cardContainer.querySelector('.popup__photos');
  var imgFeatures = photoFeaturesContainer.querySelector('img');
  photoFeaturesContainer.removeChild(imgFeatures);

  var offerTypes = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var getPhotoOffers = function (offer) {
    photoFeaturesContainer.innerHTML = '';
    offer.offer.photos.forEach(function (element) {
      var imgOffer = imgFeatures.cloneNode(true);
      imgOffer.src = element;
      photoFeaturesContainer.appendChild(imgOffer);
    });
  };

  var getFeatures = function (array) {
    featuresContainer.innerHTML = '';
    array.forEach(function (element) {
      var li = document.createElement('li');
      li.className = 'popup__feature popup__feature--' + element;
      featuresContainer.appendChild(li);
    });
  };

  var onRemoveClick = function () {
    cardContainer.remove();
  };

  var generateCard = function (offer) {
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
    mapContainer.insertBefore(cardContainer, mapContainer.lastElementChild);
  };

  window.card = {
    generate: generateCard,
    onRemoveClick: onRemoveClick,
    templateLayout: templateLayout,
    mapContainer: mapContainer,
    container: cardContainer
  };

})();
