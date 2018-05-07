'use strict';

(function () {

  var DEBOUNCE_FILTER_INTERVAL = 500;
  var filterContainer = document.querySelector('.map__filters');
  var featureFilterElements = Array.from(document.querySelectorAll('#housing-features input'));

  var filterOffer = {
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
    throw new Error('Unknow filter value');
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

  var createFiltredOffers = function (newArray) {
    window.pin.setStatus(null, true);
    window.card.container.remove();
    window.pin.generate(newArray);
    window.pin.setStatus(true, null);
  };

  var compareFiltredOffers = function () {
    var createFiltredOffersDebounced = window.util.setDebounce(createFiltredOffers, DEBOUNCE_FILTER_INTERVAL);
    var newOffers = window.data.OFFERS.filter(function (item) {
      return (((filterOffer.type === 'any') || (item.offer.type === filterOffer.type)) &&
        ((filterOffer.price === 'any') || filterPrise(filterOffer.price, item)) &&
        ((filterOffer.rooms === 'any') || (item.offer.rooms === parseInt(filterOffer.rooms, 10))) &&
        ((filterOffer.guests === 'any') || (item.offer.guests === parseInt(filterOffer.guests, 10))) &&
        ((filterOffer.features === 'any') || filterFeatures(filterOffer.features, item.offer.features))
      );
    });
    createFiltredOffersDebounced(newOffers);
  };


  var onFilterChange = function (evt) {
    var changeField = evt.target;
    var filterValue = evt.target.value;

    if (changeField.getAttribute('name') === 'features') {
      var checkedFeature = [];
      featureFilterElements.forEach(function (item) {
        if (item.checked === true) {
          checkedFeature.push(item.value);
        }
      });
      filterOffer.features = checkedFeature;
      compareFiltredOffers();
    } else {
      var atr = changeField.getAttribute('data-id');
      filterOffer[atr] = filterValue;
      compareFiltredOffers();
    }
  };

  filterContainer.addEventListener('change', onFilterChange);


  window.filter = {
    onChange: onFilterChange,
    featureFilter: featureFilterElements
  };


})();
