import React from "react";
import { useState } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import { Loader } from "@googlemaps/js-api-loader";
import TextField from "@material-ui/core/TextField";
import { Input } from "reactstrap";
const loader = new Loader({
  apiKey: "AIzaSyCz79TyOMqESl3l03P0ueb67a0U1qZ5KlI",
  version: "weekly",
  libraries: ["places"],
});
window.onload = (event) => {
  loader
    .load()
    .then((google) => {
      const input = document.getElementById("search");
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener("places_changed", () => {
        const places = autocomplete.getPlaces();
        if (places.length == 0) {
          return;
        }
      });
    })
    .catch((e) => {
      // do something
    });
};

//get current Position
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    localStorage.setItem("currentpos", JSON.stringify(pos));
  });
} else {
  alert("navigator.geolocation doesn't exist");
}

const CustomSkinMap = withScriptjs(
  withGoogleMap(() => (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{
        lat: JSON.parse(localStorage.getItem("currentpos")).lat,
        lng: JSON.parse(localStorage.getItem("currentpos")).lng,
      }}
      defaultOptions={{
        scrollwheel: false,
        zoomControl: true,
        styles: [
          {
            featureType: "water",
            stylers: [
              { saturation: 43 },
              { lightness: -11 },
              { hue: "#0088ff" },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [
              { hue: "#ff0000" },
              { saturation: -100 },
              { lightness: 99 },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#808080" }, { lightness: 54 }],
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry.fill",
            stylers: [{ color: "#ece2d9" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#ccdca1" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#767676" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }],
          },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          {
            featureType: "landscape.natural",
            elementType: "geometry.fill",
            stylers: [{ visibility: "on" }, { color: "#b8cb93" }],
          },
          { featureType: "poi.park", stylers: [{ visibility: "on" }] },
          {
            featureType: "poi.sports_complex",
            stylers: [{ visibility: "on" }],
          },
          { featureType: "poi.medical", stylers: [{ visibility: "on" }] },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "simplified" }],
          },
        ],
      }}
    >
      <Marker
        position={{
          lat: JSON.parse(localStorage.getItem("currentpos")).lat,
          lng: JSON.parse(localStorage.getItem("currentpos")).lng,
        }}
      />
    </GoogleMap>
  ))
);
export default function Maps() {
  const [locationx, setLocationX] = useState("");
  const [locationy, setLocationY] = useState("");
  const handleInputChange = (e) => {
    if ((e.target.id = "locationx")) {
      setLocationX(e.target.value);
      let pos = JSON.parse(localStorage.getItem("currentpos"));
      pos.lat = Number(e.target.value.replaceAll(" ", ""));
      localStorage.setItem("currentpos", JSON.stringify(pos));
    } else if ((e.target.id = "locationy")) {
      setLocationY(e.target.value);
      let pos = JSON.parse(localStorage.getItem("currentpos"));
      pos.lng = Number(e.target.value.replaceAll(" ", ""));
      localStorage.setItem("currentpos", JSON.stringify(pos));
    }
  };
  return (
    <div>
      <TextField id="search" label="Search" variant="outlined" />
      <br></br>
      <br></br>
      <TextField
        id="locationx"
        label="locationx"
        variant="outlined"
        onChange={handleInputChange}
      />
      <TextField
        id="locationy"
        label="locationy"
        variant="outlined"
        onChange={handleInputChange}
      />
      <CustomSkinMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCz79TyOMqESl3l03P0ueb67a0U1qZ5KlI&libraries=places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
    //Iframe
    // <div>
    //   <iframe
    //     width="100%"
    //     height="600"
    //     frameborder="0"
    //     scrolling="no"
    //     marginheight="0"
    //     marginwidth="0"
    //     src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+()&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
    //   >
    //     <a href="https://www.maps.ie/distance-area-calculator.html">
    //       area maps
    //     </a>
    //   </iframe>
    // </div>
  );
}
