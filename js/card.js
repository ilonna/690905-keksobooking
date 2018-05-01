'use strict';

(function () {

  var featuresContainer = cardContainer.querySelector('.popup__features');
  var photoFeaturesContainer = cardContainer.querySelector('.popup__photos');
  var photoFeatures = photoFeaturesContainer.querySelector('img');
  photoFeaturesContainer.removeChild(photoFeatures);

  var getPhotoOffers = function (offer) {
    photoFeaturesContainer.innerHTML = '';
    offer.offer.photos.forEach(function (element) {
      var imgElement = photoFeatures.cloneNode(true);
      imgElement.src = element;
      photoFeaturesContainer.appendChild(imgElement);
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

  window.generateOffers = function (offer) {
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


})();
