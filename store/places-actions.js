import * as FileSystem from 'expo-file-system';
import { fetchPlaces, insertPlace } from '../helpers/db';
export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';

export const addPlace = (title, selectedImage) => {
    return async dispatch => {
        const filename = selectedImage.split('/').pop();
        const newPath = FileSystem.documentDirectory + filename;

        try {
            await FileSystem.moveAsync({
                from: selectedImage,
                to: newPath
            });
            const result = await insertPlace(title, newPath, 'Dummy Address', 15.6, 12.3);
            dispatch({
                type: ADD_PLACE,
                placeData: {
                    id: result.insertId,
                    title: title,
                    selectedImage: newPath
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