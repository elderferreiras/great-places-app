import * as FileSystem from 'expo-file-system';
import ENV from '../env';

import { fetchPlaces, insertPlace } from '../helpers/db';
export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';

export const addPlace = (title, selectedImage, location) => {
    return async dispatch => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`);

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        if (!resData.results) {
            throw new Error('Something went wrong!');
        }

        const address = resData.results[0].formatted_address;

        const filename = selectedImage.split('/').pop();
        const newPath = FileSystem.documentDirectory + filename;

        try {
            await FileSystem.moveAsync({
                from: selectedImage,
                to: newPath
            });

            const result = await insertPlace(title, newPath, address, location.lat, location.lng);

            dispatch({
                type: ADD_PLACE,
                placeData: {
                    id: result.insertId,
                    title: title,
                    selectedImage: newPath,
                    address: address,
                    coords: {
                        lat: location.lat,
                        lng: location.lng
                    }
                }
            });
        } catch(err) {
            console.log(err);
            throw err;
        }
    };
};

export const loadPlaces = () => {
    return async dispatch => {
      try {
          const result = await fetchPlaces();
          dispatch({type: SET_PLACES, places: result.rows._array});
      } catch (err) {
          throw err;
      }
    };
};