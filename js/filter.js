'use strict';

(function () {


  var filterContainer = document.querySelector('.map__filters');
  var typeFilter = filterContainer.querySelector('#housing-type');
  var priceFilter = filterContainer.querySelector('#housing-price');
  var roomFilter = filterContainer.querySelector('#housing-rooms');
  var guestFilter = filterContainer.querySelector('#housing-guests');
  window.featureFilter = Array.from(document.querySelectorAll('#housing-features input'));

  var filterOFFER = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: []
  };

  var priceValue = {
    low: 10000,
    high: 50000
  };

  var filterPrise = function (filterValue, item) {
    switch (filterValue) {
      case 'low':
        return item.offer.price < priceValue.low;
      case 'middle':
        return item.offer.price >= priceValue.low && item.offer.price <= priceValue.high;
      case 'high':
        return item.offer.price > priceValue.high;
    }
  };

  var filterFeatures = function (myFeatures, offerFeatures) {
    for (var j = 0; j < myFeatures.length; j++) {
      var found = false;
      for (var i = 0; i < offerFeatures.length; i++) {
        if (myFeatures[j] === offerFeatures[i]) {
          found = true;
          break;
        }
      }
      if (!found) {
        return false;
      }
    }
    return true;
  };

  var createFiltredOFFER = function (newArray) {
    var pinsArray = Array.from(document.querySelectorAll('.map__pin'));
    var limitFilterOffers = newArray.slice(0,PIN_LIMIT);
    for (var j = 0; j < pinsArray.length; j++) {
      if (!pinsArray[j].classList.contains('map__pin--main')) {
        pinsArray[j].remove();
      }
    }
    window.map.removeCard();
    for (var i = 0; i < limitFilterOffers.length; i++) {
      var offer = limitFilterOffers[i];
      window.pin.createPin(offer, true);
    }
  };

  var filterOFFERS = function () {
    var createFiltredOFFERDebounced = window.util.setDebounce(createFiltredOFFER);
    var newOFFERS = OFFERS.filter(function (item) {
      return (((filterOFFER.type === 'any') ? true : (item.offer.type === filterOFFER.type)) &&
        ((filterOFFER.price === 'any') ? true : filterPrise(filterOFFER.price, item)) &&
        ((filterOFFER.rooms === 'any') ? true : (item.offer.rooms === parseInt(filterOFFER.rooms))) &&
        ((filterOFFER.guests === 'any') ? true : (item.offer.guests === parseInt(filterOFFER.guests))) &&
        ((filterOFFER.features === 'any') ? true : filterFeatures(filterOFFER.features, item.offer.features))
      );
    });
    createFiltredOFFERDebounced(newOFFERS);
  };


  var changeFilter = function (evt) {
    var changeField = evt.target;
    var filterValue = evt.target.value;

    if (changeField.getAttribute('name') === 'features') {
      var checkedFeature = [];
      featureFilter.map(function (item) {
        if (item.checked === true) {
          checkedFeature.push(item.value);
        }
      });
      filterOFFER.features = checkedFeature;
      filterOFFERS();
    } else {
      var atr = changeField.getAttribute('data-id');
      filterOFFER[atr] = filterValue;
      filterOFFERS();
    }
  };

  filterContainer.addEventListener('change', changeFilter);



  window.filter = {
    changeFilter: changeFilter
  };


})();
