import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {

    const [location, setLocation] = useState({
        latitude: 65.0800,
        longitude: 25.4800,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [markers, setMarkers] = useState([]);

    const showMarker = (e) => {
        const coords = e.nativeEvent.coordinate;
        setMarkers([...markers, { latitude: coords.latitude, longitude: coords.longitude }]);
    }

    const getUserPosition = async () => {
        let status = await Location.requestForegroundPermissionsAsync()

        try {
            if (status !== 'granted'){
                console.log('Permissions are not granted');
                return;
            }

            const position = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
            setLocation({ ...location, latitude: position.coords.latitude, longitude: position.coords.longitude })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        (async() => {
            getUserPosition();
        })()
    }, [])

    return (
        <MapView
            style={styles.map}
            region={location}
            mapType='satellite'
            onLongPress={showMarker}
        >
            {markers?.map((m, index) => (
                <Marker
                    key={index}
                    title={'Mark' + ++index}
                    coordinate={{ latitude: m.latitude, longitude: m.longitude }}
                />
            ))
            }
        </MapView>
    );
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
  },
});
