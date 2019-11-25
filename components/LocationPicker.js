import React, { useState, useEffect } from 'react';
import { View, Button, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapPreview from '../components/MapPreview';

const LocationPicker = props => {
    const [pickedLocation, setPickedLocation] = useState();
    const [isFetching, setIsFetching] = useState(false);

    const mapPickedLocation = props.navigation.getParam('pickedLocation');
    const  { onLocationPicked } = props;

    useEffect(() => {
        if (mapPickedLocation) {
            setPickedLocation(mapPickedLocation);
            onLocationPicked({
                lat: mapPickedLocation.lat,
                lng: mapPickedLocation.lng
            });
        }
    }, [mapPickedLocation, onLocationPicked]);

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
            const location = await Location.getCurrentPositionAsync({timeout: 5000});
            setPickedLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
            props.onLocationPicked({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
        } catch (err) {
            Alert.alert(
                'Could not fetch location!',
                'Please try again later.',
                [{text: 'Okay'}]
            );
        }

        setIsFetching(false);
    };

    const pickOnMapHandler = () => {
        props.navigation.navigate('Map');
    };

    return (
        <View style={styles.locationPicker}>
            <MapPreview style={styles.mapPreview} location={pickedLocation}>
                {!isFetching ? <View style={styles.mapPreview}>
                    <Text>No location chosen yet!</Text>
                </View> : <ActivityIndicator size="large" color={Colors.primary}/>}
            </MapPreview>
            <View style={styles.actions}>
                <Button title="Get user location" color={Colors.primary} onPress={getLocationHandler}/>
                <Button title="Pick On Map" color={Colors.primary} onPress={pickOnMapHandler}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
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