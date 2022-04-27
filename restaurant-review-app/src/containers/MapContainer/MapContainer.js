import React, { Component } from 'react';
import classes from './MapContainer.module.css';
import SideBar from '../../components/App/Layout/SideBar/SideBar';
import Modal from '../../components/UI/Modal/Modal';
import AddRestaurant from '../../components/App/Layout/AddRestaurant/AddRestaurant';
import axios from 'axios';

let map;
let markers = [];
let visibleOnMap = [];
let newLat;
let newLng;
let lastAverageRating;
let startingCenter = {lat: 53.799241150620674, lng: -1.5418059473662424};

class MapContainer extends Component {
  state = {
    jsonPlaces: [],
    googlePlaces: [],
    googlePlacesFiltered: [],
    listStatus: 'loading',
    restaurantDetailsShowStatus: false,
    restaurantDetailsData: null,
    filter: {
      filterMin: 0,
      filterMax: 5
    },
    filterButtonsDisabled: {
      minLess: true,
      minMore: false,
      maxLess: false,
      maxMore: true
    },
    addingRestaurantStatus: false,
    newRestaurantData: {
      name: '',
      phone: '',
      website: ''
    },
    addRestaurantButtonDisabled: true,
    newRestaurants: [],
    addingReviewStatus: false,
    newReviewData: {
      firstName: '',
      lastName: '',
      review: '',
      userRating: 0
    },
    addReviewButtonDisabled: true,
    newReviews: [],
    lastAverageRatings: [],
    geolocationPermission: true
  }
  
  componentDidMount() {
    // Loading data from json file
    axios.get("http://localhost:3004/jsonRestaurants")
      .then(response => {
        if (response) {
          response.data.forEach((place) => {
            let rating = this.countAverageRating(place.placeDetails.reviews);
            place.rating = rating;
          });
          this.setState({jsonPlaces: response.data}, this.renderMap());
        }
      }
    );
  }
  
  // Loading Map function
  renderMap = () => {
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCB5-GzZHw_xyz2Aj9-p5XDVEkrIUb1cD8&libraries=places&callback=initMap');
    window.initMap = this.initMap;
  }
  
  // Init map callback function
  initMap = () => {
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: startingCenter,
      zoom: 16
    });
    
    // Getting geolocation
    navigator.geolocation.getCurrentPosition(
      // When user will allow browser to know his location
      (position) => {
        let pos = {lat: position.coords.latitude, lng: position.coords.longitude};
        map.setCenter(pos);
        this.setUserMarker(pos, map);
      },
      // When user will not allow browser to know his location
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          this.setUserMarker(startingCenter, map);
          this.setState({geolocationPermission: false});
        }
      }
    );
    
    // When map is idle event listener
    map.addListener('idle', () => {
      if (this.state.restaurantDetailsShowStatus) {
        this.restaurantDetailsHideHandler();
      }
      this.updatePlaces();
    });
    
    // When user right click on a map event listener
    map.addListener('rightclick', (event) => {
      newLat = event.latLng.lat();
      newLng = event.latLng.lng();
      this.addingRestaurantShowHandler();
    });
  }
  
  // Updating places method
  updatePlaces = () => {
    // Removing markers from a map
    this.removeMarkers();
    // Reseting visible on a map array
    visibleOnMap = [];
    // Setting list status to loading
    this.setState({listStatus: 'loading'});
    // Getting actual map center
    let actualCenter = map.getCenter();
    let actualCenterLat = actualCenter.lat();
    let actualCenterLng = actualCenter.lng();
    // Getting actual map bounds
    let actualBounds = map.getBounds();
    let places = [];
    if (this.state.newRestaurants.length !== 0) {
      places = [...this.state.newRestaurants];
      let jsonPlaces = [...this.state.jsonPlaces];
      jsonPlaces.forEach((jsonPlace) => {
        places.push(jsonPlace);
      });
    } else {
      places = [...this.state.jsonPlaces];
    }
    // Creating nearby search request
    let nearbySearchRequest = {
      location: {lat: actualCenterLat, lng: actualCenterLng},
      radius: '500',
      type: ['restaurant']
    };
    // Sending nearby search request
    let nearbySearchService = new window.google.maps.places.PlacesService(map);
    nearbySearchService.nearbySearch(nearbySearchRequest, (nearbySearchResults, status) => {
      // When nearby search response is received
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        nearbySearchResults.forEach((place) => {
          // If place has no rating yet then setting rating to zero
          if (!place.rating) {
            place.rating = 0;
          } else {
            place.rating = place.rating.toFixed(1);
          }
          // Adding place to places array
          places.push(place);
        });
        this.checkVisibilityOnMap(places, actualBounds);
      } else {
        this.checkVisibilityOnMap(places, actualBounds);
      }
    });
  }
  
  // Counting average rating from reviews method
  countAverageRating = (reviews) => {
    let averageRating = 0;
    let numOfRatings = reviews.length;
    let sum = 0;
    reviews.forEach((review) => {
      let rating = review.rating;
      sum += rating;
    });
    averageRating = sum / numOfRatings;
    return averageRating;
  }
  
  // Checking if place is in actual map bounds method
  checkVisibilityOnMap = (places, actualBounds) => {
    places.forEach((place) => {
      // Getting place latitude
      let lat = this.findLat(place);
      // Getting place longitude
      let lng = this.findLng(place);
      // If actual map bounds contains coordinates of the place...
      if (actualBounds.contains({lat, lng})) {
        // ... then adding place to visible on a map array
        visibleOnMap.push(place);
      }
    });
    if (visibleOnMap.length === 0) {
      this.setState({listStatus: 'notInMapBounds'});
      this.setState({googlePlacesFiltered: []});
    } else {
      this.setState({googlePlaces: visibleOnMap});      
      if ((this.state.filter.filterMin === 0) && (this.state.filter.filterMax === 5)) {
        this.setState({googlePlacesFiltered: visibleOnMap});
        this.setState({listStatus: 'loaded'});
        this.addMarkers(visibleOnMap);
      } else {
        this.applyFiltersHandler(this.state.filter);
        this.setState({listStatus: 'loaded'});
      }
    }
  }
  
  // Finding latitude method
  findLat = (place) => {
    let lat;
    if (place.lat) {
      lat = place.lat;
    } else {
      lat = place.geometry.location.lat();
    }
    return lat;
  }
  
  // Finding longitude method
  findLng = (place) => {
    let lng;
    if (place.lng) {
      lng = place.lng;
    } else {
      lng = place.geometry.location.lng();
    }
    return lng;
  }
  
  // Adding markers and info window for every visible restaurant on a map method
  addMarkers = (places) => {
    // Creating info window
    let infoWindow = new window.google.maps.InfoWindow({});
    places.forEach((place) => {
      let marker = new window.google.maps.Marker({
        position: {lat: this.findLat(place), lng: this.findLng(place)},
        map: map,
        title: place.name
      });
      markers.push(marker);
      // Setting info window content
      let infoWindowContent = document.createElement('div');
      let divName = document.createElement('div');
      divName.style.fontWeight = '700';
      divName.innerHTML = place.name;
      let divVicinity = document.createElement('div');
      divVicinity.innerHTML = place.vicinity;
      infoWindowContent.appendChild(divName);
      infoWindowContent.appendChild(divVicinity);
      // Adding event listener for marker
      marker.addListener('click', () => {
      infoWindow.setContent(infoWindowContent);
      infoWindow.open(map, marker);
      });
    });
  }
  
  // Removing markers from a map method
  removeMarkers = () => {
    if (markers.length !== 0) {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }
  }
  
  // Switching marker bounce for clicked restaurant on
  switchMarkerBounceOn = (lat, lng) => {
    let markerIndex = markers.findIndex(marker => (marker.position.lat() === lat) && (marker.position.lng() === lng));
    markers[markerIndex].setAnimation(window.google.maps.Animation.BOUNCE);
  }
  
  // Switching marker bounce off
  switchMarkerBounceOff = () => {
    markers.forEach((marker) => {
      if (marker.animation === 1) {
        marker.setAnimation(null);
      }
    });
  }
  
  // Placing user marker method
  setUserMarker = (center, map) => {
    new window.google.maps.Marker({
      position: center,
      map: map,
      animation: window.google.maps.Animation.DROP,
      icon: {url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
      title:'Your Position',
      zIndex: 100
    });
  }
  
  // Updating filter criteria method
  updateFiltersHandler = (event) => {
    let filter = {...this.state.filter};
    switch (event.target.id) {
      case "minLess":
        filter.filterMin -= 1;
        break;
      case "minMore":
        filter.filterMin += 1;
        break;
      case "maxLess":
        filter.filterMax -= 1;
        break;
      case "maxMore":
        filter.filterMax += 1;
        break;
      default:
        break;
    }
    if (filter.filterMax < filter.filterMin) {
      filter.filterMax = filter.filterMin;
    }
    this.setState({filter: filter});
    this.filterButtonsDisabledUpdate(filter);
  }
  
  // Updating filter buttons disabled criteria method
  filterButtonsDisabledUpdate = (filter) => {
    let filterButtonsDisabled = {...this.state.filterButtonsDisabled}
    // Filter minLess button
    if (filter.filterMin > 0) {
      filterButtonsDisabled.minLess = false;
    } else if (filter.filterMin === 0) {
      filterButtonsDisabled.minLess = true;
    }
    // Filter minMore button
    if (filter.filterMin < 5) {
      filterButtonsDisabled.minMore = false;
    } else if (filter.filterMin === 5) {
      filterButtonsDisabled.minMore = true;
    }
    // Filter maxLess button
    if (filter.filterMax > filter.filterMin) {
      filterButtonsDisabled.maxLess = false;
    } else if (filter.filterMax === filter.filterMin) {
      filterButtonsDisabled.maxLess = true;
    }
    // Filter maxMore button
    if (filter.filterMax < 5) {
      filterButtonsDisabled.maxMore = false;
    } else if (filter.filterMax === 5) {
      filterButtonsDisabled.maxMore = true;
    }
    this.setState({filterButtonsDisabled: filterButtonsDisabled});
    this.applyFiltersHandler(filter);
  }
  
  // Applying filter criteria method
  applyFiltersHandler = (filter) => {
    let filterMin = filter.filterMin;
    let filterMax = filter.filterMax;
    let googlePlacesFiltered = [];
    visibleOnMap.forEach((placeElement) => {
      let averageRating;
      let index = this.state.lastAverageRatings.findIndex((elem) => (elem.place_id === placeElement.place_id));
      if (index !== -1) {
        averageRating = this.state.lastAverageRatings[index].lastAverageRating;
      } else {
        averageRating = placeElement.rating;
      }
      if ((averageRating >= filterMin) && (averageRating <= filterMax)) {
        googlePlacesFiltered.push(placeElement);
      }
    });
    if (googlePlacesFiltered.length === 0) {
      if (visibleOnMap.length === 0) {
        this.setState({listStatus: 'notInMapBounds'});
      } else {
        this.setState({listStatus: 'notInFilterCriteria'});
        this.removeMarkers();
      }
    } else {
      this.setState({googlePlacesFiltered: googlePlacesFiltered});
      // Setting list status to loaded
      this.setState({listStatus: 'loaded'});
      this.removeMarkers();
      this.addMarkers(googlePlacesFiltered);
    }
  }
  
  // Reseting filter criteria method
  resetFilter = () => {
    if ((this.state.filter.filterMin !== 0 || this.state.filter.filterMax !== 5)) {
      let filter = {...this.state.filter};
      filter.filterMin = 0;
      filter.filterMax = 5;
      this.setState({filter: filter});
      this.filterButtonsDisabledUpdate(filter);
    }
  }
  
  // Showing restaurant details method
  restaurantDetailsShowHandler = (placeId) => {
    let restaurantDetailsData;
    if (typeof placeId === 'number') {
      let jsonPlaces = [...this.state.jsonPlaces];
      let index = jsonPlaces.findIndex(dataElement => dataElement.place_id === placeId);
      if (index !== -1) {
        restaurantDetailsData = jsonPlaces[index];
      } else {
        let newRestaurants = [...this.state.newRestaurants];
        index = newRestaurants.findIndex(dataElement => dataElement.place_id === placeId);
        restaurantDetailsData = newRestaurants[index];
      }
      this.setState({restaurantDetailsData: restaurantDetailsData});
      this.setState({restaurantDetailsShowStatus: true});
      this.switchMarkerBounceOn(this.findLat(restaurantDetailsData), this.findLng(restaurantDetailsData));
    } else {
      // Creating place details service request
      let placeDetailsRequest = {
        placeId: placeId,
        fields: ['formatted_phone_number', 'reviews', 'website']
      };
      let placeDetailsService = new window.google.maps.places.PlacesService(map);
      // Sending place details request
      placeDetailsService.getDetails(placeDetailsRequest, (placeDetailsResults, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          let googlePlaces = [...this.state.googlePlaces];
          let index = googlePlaces.findIndex(dataElement => dataElement.place_id === placeId);
          restaurantDetailsData = googlePlaces[index];
          restaurantDetailsData.placeDetails = placeDetailsResults;
          this.setState({restaurantDetailsData: restaurantDetailsData});
          this.setState({restaurantDetailsShowStatus: true});
          this.switchMarkerBounceOn(this.findLat(restaurantDetailsData), this.findLng(restaurantDetailsData));
        }
      });
    }
  }
  
  // Hiding restaurant details method
  restaurantDetailsHideHandler = () => {
    this.addingReviewHideHandler();
    this.setState({restaurantDetailsShowStatus: false});
    this.switchMarkerBounceOff();
    this.updateLastAverageRatings();
  }
  
  // Showing add new restaurant component method
  addingRestaurantShowHandler = () => {
    this.setState({addingRestaurantStatus: true});
  }
  
  // Hiding add new restaurant component method
  addingRestaurantHideHandler = () => {
    this.resetNewRestaurantData();
    this.disableAddRestaurantButton();
    this.setState({addingRestaurantStatus: false});
  }
  
  // Changing new restaurant data method
  newRestaurantDataChangeHandler = (event) => {
    let newRestaurantData = {...this.state.newRestaurantData};
    const name = event.target.name;
    const value = event.target.value;
    let newValue = value;
    newRestaurantData[name] = newValue;
    // Checking if restaurant name field contains only white spaces
    if (newRestaurantData.name.replace(/\s/g, '').length) {
      this.enableAddRestaurantButton();
    } else {
      this.disableAddRestaurantButton();
    }
    this.setState({newRestaurantData: newRestaurantData});
  }
  
  // Enabling add restaurant button method
  enableAddRestaurantButton = () => {
    this.setState({addRestaurantButtonDisabled: false});
  }
  
  // Disabling add restaurant button method
  disableAddRestaurantButton = () => {
    this.setState({addRestaurantButtonDisabled: true});
  }
  
  // Add new restaurant button handler method
  addRestaurant = (event) => {
    event.preventDefault();
    let lastPlaceId = 0;
    let placesToFindLastId;
    if (this.state.newRestaurants.length !== 0) {
      placesToFindLastId = [...this.state.newRestaurants];
    } else {
      placesToFindLastId = [...this.state.jsonPlaces];
    }
    placesToFindLastId.forEach((place) => {
      if (place.place_id > lastPlaceId) {
        lastPlaceId = place.place_id;
      }
    });
    let newRestaurantData = {};
    newRestaurantData.place_id = lastPlaceId + 1;
    newRestaurantData.lat = newLat;
    newRestaurantData.lng = newLng;
    newRestaurantData.name = this.state.newRestaurantData.name;
    newRestaurantData.placeDetails = {};
    if (this.state.newRestaurantData.phone) {
      newRestaurantData.placeDetails.formatted_phone_number = this.state.newRestaurantData.phone;
    }
    if (this.state.newRestaurantData.website) {
      newRestaurantData.placeDetails.website = this.state.newRestaurantData.website;
      // Checking if website address starts with http:// or https://
      let addressRegex = /^http:\/\/|^https:\/\//;
      if (!addressRegex.test(newRestaurantData.placeDetails.website)) {
        // If not then add http:// at the beggining of the address
        let begin = 'http://';
        newRestaurantData.placeDetails.website = begin + newRestaurantData.placeDetails.website;
      }
    }
    newRestaurantData.rating = 0;
    let newAddress = 'Address not available';
    // Creating reverse geocoding request
    let geocodeRequest = {
      location: {lat: newLat, lng: newLng}
    };
    // Sending geocoding request
    let geocodingService = new window.google.maps.Geocoder(map);
    geocodingService.geocode(geocodeRequest, (geocodeResults, status) => {
      if (status === 'OK') {
        if (geocodeResults[0]) {
          let streetNumber = '';
          let streetName = '';
          let cityName = '';
          let premise = '';
          for (let i = 0; i < geocodeResults[0].address_components.length; i++) {
            for (let j = 0; j < geocodeResults[0].address_components[i].types.length; j++) {
              switch (geocodeResults[0].address_components[i].types[j]) {
                case 'street_number':
                  streetNumber = geocodeResults[0].address_components[i].long_name;
                  break;
                case 'route':
                  streetName = geocodeResults[0].address_components[i].long_name;
                  break;
                case 'postal_town':
                  cityName = geocodeResults[0].address_components[i].long_name;
                  break;
                case 'premise':
                  premise = geocodeResults[0].address_components[i].long_name;
                  break;
              }
            }
          }
          if ((streetNumber !== '') && (streetName !== '') && (cityName !== '')) {
            newAddress = streetNumber + ' ' + streetName + ', ' + cityName;
          }
          if ((streetNumber === '') && (premise !== '') && (streetName !== '') && (cityName !== '')) {
            newAddress = premise + ', ' + streetName + ', ' + cityName;
          } 
        }
      }
      newRestaurantData.vicinity = newAddress;
      let newRestaurants = [...this.state.newRestaurants];
      newRestaurants.unshift(newRestaurantData);
      this.setState({newRestaurants: newRestaurants});
      this.updatePlaces();
      let newCenter = new window.google.maps.LatLng(newLat,newLng);
      map.panTo(newCenter);
      this.addingRestaurantHideHandler();
    });
    this.resetFilter();
  }
  
  // Cancel add new restaurant button handler method
  cancelAddingRestaurant = (event) => {
    event.preventDefault();
    this.resetNewRestaurantData();
    this.addingRestaurantHideHandler();
  }
  
  // Reseting new restaurant data method
  resetNewRestaurantData = () => {
    this.setState({
      newRestaurantData: {
      name: '',
      phone: '',
      website: ''
      }
    });
  }
  
  // Showing adding review form
  addingReviewShowHandler = () => {
    this.resetNewReviewData();
    this.disableAddReviewButton();
    this.setState({addingReviewStatus: true});
  }
  
  // Hiding adding review form
  addingReviewHideHandler = () => {
    this.setState({addingReviewStatus: false});
  }
  
  // Changing new review data method
  newReviewDataChangeHandler = (event) => {
    let newReviewData = {...this.state.newReviewData}
    if (event.target.name) {
      const name = event.target.name;
      const value = event.target.value;
      newReviewData[name] = value;
    } else {
      const id = event.target.id;
      newReviewData.userRating = id;
    }
    if (((newReviewData.firstName.length !== 0) && (newReviewData.firstName.replace(/\s/g, '').length)) && ((newReviewData.lastName.length !== 0) && (newReviewData.lastName.replace(/\s/g, '').length)) && ((newReviewData.review.length !== 0) && (newReviewData.review.replace(/\s/g, '').length)) && (newReviewData.userRating !== 0)) {
      this.enableAddReviewButton();
    } else {
      this.disableAddReviewButton();
    }
    this.setState({newReviewData: newReviewData});
  }
  
  // Enabling add review button method
  enableAddReviewButton = () => {
    this.setState({addReviewButtonDisabled: false});
  }
  
  // Disabling add review button method
  disableAddReviewButton = () => {
    this.setState({addReviewButtonDisabled: true});
  }
  
  // Adding review method
  addReview = (event) => {
    event.preventDefault();
    let newReviewData = {...this.state.newReviewData};
    let newReviews = [...this.state.newReviews];
    let place_id = this.state.restaurantDetailsData.place_id;
    let author_name = newReviewData.firstName + ' ' + newReviewData.lastName;
    let rating = newReviewData.userRating;
    let text = newReviewData.review;
    let newReview = {};
    newReview.author_name = author_name;
    newReview.rating = Number(rating);
    newReview.text = text;
    let index = newReviews.findIndex(elem => (elem.place_id === place_id));
    if (index === -1) {
      let newPlace = {};
      newPlace.place_id = place_id;
      newPlace.reviews = [];
      newPlace.reviews.push(newReview);
      newReviews.push(newPlace);
    } else {
      newReviews[index].reviews.unshift(newReview);
    }
    this.setState({newReviews: newReviews});
    this.addingReviewHideHandler();
  }
  
  // Canceling adding review method
  cancelAddingReview = (event) => {
    event.preventDefault();
    this.addingReviewHideHandler();
  }
  
  // Reseting new review data method
  resetNewReviewData = () => {
    this.setState({
      newReviewData: {
        firstName: '',
        lastName: '',
        review: '',
        userRating: 0
      }
    });
  }
  
  getLastAverageRating = (rating) => {
    lastAverageRating = rating;
  }
  
  updateLastAverageRatings = () => {
    let lastAverageRatings = [...this.state.lastAverageRatings];
    let index = lastAverageRatings.findIndex((elem) => (elem.place_id === this.state.restaurantDetailsData.place_id));
    if (index === -1) {
      let newAverageRating = {};
      newAverageRating.place_id = this.state.restaurantDetailsData.place_id;
      newAverageRating.lastAverageRating = lastAverageRating;
      lastAverageRatings.push(newAverageRating);
    } else {
      lastAverageRatings[index].lastAverageRating = lastAverageRating;
    }
    this.setState({lastAverageRatings: lastAverageRatings}, () => this.applyFiltersHandler(this.state.filter));
  }
  
  render() {
    
    let geoInfo = null;
    if (!this.state.geolocationPermission) {
      geoInfo = (
        <div className={classes.GeoInfo}>
          <p>We don't have access to your location. If you let us to have it, please change settings and reload the page</p>
        </div>
      );
    }
    
    return (
      <div className={classes.MapContainer}>
        <Modal 
          addingRestaurantStatus={this.state.addingRestaurantStatus} 
          addingRestaurantHideHandler={this.addingRestaurantHideHandler}
        >
          <AddRestaurant
            addRestaurant={this.addRestaurant}
            cancelAddingRestaurant={this.cancelAddingRestaurant}
            newRestaurantData={this.state.newRestaurantData}
            newRestaurantDataChangeHandler={this.newRestaurantDataChangeHandler}
            addRestaurantButtonDisabled={this.state.addRestaurantButtonDisabled}
          />
        </Modal>
        {geoInfo}
        <div className={classes.Map} id="map"></div>
        <div className={classes.SideBar}>
          <SideBar 
            googlePlacesFiltered={this.state.googlePlacesFiltered}
            listStatus={this.state.listStatus}
            filterData={this.state.filter}
            filterButtonsDisabled={this.state.filterButtonsDisabled}
            updateFiltersHandler={this.updateFiltersHandler}
            resetFilter={this.resetFilter}
            restaurantDetailsShowStatus={this.state.restaurantDetailsShowStatus}
            restaurantDetailsShowHandler={this.restaurantDetailsShowHandler}
            restaurantDetailsHideHandler={this.restaurantDetailsHideHandler}
            restaurantDetailsData={this.state.restaurantDetailsData}
            addingReviewStatus={this.state.addingReviewStatus}
            addingReviewShowHandler={this.addingReviewShowHandler}
            newReviewData={this.state.newReviewData}
            newReviewDataChangeHandler={this.newReviewDataChangeHandler}
            addReviewButtonDisabled={this.state.addReviewButtonDisabled}
            addReview={this.addReview}
            cancelAddingReview={this.cancelAddingReview}
            newReviews={this.state.newReviews}
            countAverageRating={this.countAverageRating}
            getLastAverageRating={this.getLastAverageRating}
            lastAverageRatings={this.state.lastAverageRatings}
          />
        </div>
      </div>
    );
  }
}

// Loading API script function
function loadScript(url) {
  let index = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default MapContainer;
