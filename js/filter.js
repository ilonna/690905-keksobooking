'use strict';

(function () {

  var DEBOUNCE_FILTER_INTERVAL = 500;
  var filterContainer = document.querySelector('.map__filters');
  var typeFilter = filterContainer.querySelector('#housing-type');
  var priceFilter = filterContainer.querySelector('#housing-price');
  var roomFilter = filterContainer.querySelector('#housing-rooms');
  var guestFilter = filterContainer.querySelector('#housing-guests');
  var featureFilter = Array.from(document.querySelectorAll('#housing-features input'));

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
    var found = false;
    for (var j = 0; j < myFeatures.length; j++) {
      found = offerFeatures.includes(myFeatures[j]);
      if (!found) {
        return false;
      }
    }
    return true;
  };

  var createFiltredOFFER = function (newArray) {
    window.pin.setStatusPins(null, true);
    window.card.removeCard();
    window.pin.generatePins(newArray);
    window.pin.setStatusPins(true, null);
  };

  var filterOFFERS = function () {
    var createFiltredOFFERDebounced = window.util.setDebounce(createFiltredOFFER, DEBOUNCE_FILTER_INTERVAL);
    var newOFFERS = window.data.OFFERS.filter(function (item) {
      return (((filterOFFER.type === 'any') || (item.offer.type === filterOFFER.type)) &&
        ((filterOFFER.price === 'any') || filterPrise(filterOFFER.price, item)) &&
        ((filterOFFER.rooms === 'any') || (item.offer.rooms === parseInt(filterOFFER.rooms))) &&
        ((filterOFFER.guests === 'any') || (item.offer.guests === parseInt(filterOFFER.guests))) &&
        ((filterOFFER.features === 'any') || filterFeatures(filterOFFER.features, item.offer.features))
      );
    });
    createFiltredOFFERDebounced(newOFFERS);
  };


  var changeFilter = function (evt) {
    var changeField = evt.target;
    var filterValue = evt.target.value;

    if (changeField.getAttribute('name') === 'features') {
      var checkedFeature = [];
      featureFilter.forEach(function (item) {
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
    changeFilter: changeFilter,
    featureFilter: featureFilter

  };


})();
