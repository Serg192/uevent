import React from "react";
import Autocomplete from "react-google-autocomplete";

const EditCompany = () => {
  const onPlaceSelected = async (place) => {
    const lat = place?.geometry?.location?.lat();
    const lng = place?.geometry?.location?.lng();
    console.log(`lat: ${lat}, lng: ${lng}`);
  };

  return (
    <Autocomplete
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      onPlaceSelected={onPlaceSelected}
    />
  );
};

export default EditCompany;
