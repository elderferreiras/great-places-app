import * as FileSystem from 'expo-file-system';

export const ADD_PLACE = 'ADD_PLACE';

export const addPlace = (title, selectedImage) => {
    return async dispatch => {
        const filename = selectedImage.split('/').pop();
        const newPath = FileSystem.documentDirectory + filename;

        try {
            await FileSystem.moveAsync({
                from: selectedImage,
                to: newPath
            });
        } catch(err) {
            console.log(err);
            throw err;
        }

        dispatch({
            type: ADD_PLACE,
            placeData: {
                title: title,
                selectedImage: newPath
            }
        });
    };
};