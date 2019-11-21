import React, { useState } from 'react';
import {View, Button, Text, ActivityIndicator, Alert, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapPreview from '../components/MapPreview';

const LocationPicker = props => {
    const [pickedLocation, setPickedLocation] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant location permissions to use this app.',
                [{text: 'Okay'}]
            );
            return false;
        }

        return true;
    };

    const getLocationHandler = async () => {
        const hasPermissions = await verifyPermissions();

        if (!hasPermissions) {
            return;
        }

        try {
            setIsFetching(true);
            const location =  await Location.getCurrentPositionAsync({timeout: 5000});
            setPickedLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            })
        } catch (err) {
            Alert.alert(
                'Could not fetch location!',
                'Please try again later.',
                [{text: 'Okay'}]
            );
        }

        setIsFetching(false);
    };

    return (
        <View style={styles.locationPicker}>
            <MapPreview style={styles.mapPreview} location={pickedLocation}>
                {!isFetching? <View style={styles.mapPreview}>
                    <Text>No location chosen yet!</Text>
                </View> : <ActivityIndicator size="large" color={Colors.primary}/>}
            </MapPreview>
            <Button title="Get user location" color={Colors.primary} onPress={getLocationHandler}/>
        </View>
    );
};

const styles = StyleSheet.create({
    locationPicker: {
        marginBottom: 15,
    },
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: 150,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default LocationPicker;