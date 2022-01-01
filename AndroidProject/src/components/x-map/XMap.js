import React, {useEffect, useRef, useState} from 'react';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from "react-native-maps";
import { StyleSheet, Text, View} from "react-native";
import {SilverMapStyleData} from "./data/silverMapStyle.data";
import {useDispatch, useSelector} from "react-redux";
import Svg, {Image} from "react-native-svg";
import {MainState} from "../../services/store/reducers/MainReducer";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        width: "100%",
        flex: 1,
    },
});

export const XMap = ()=> {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.main.user);
    const users = useSelector(state => state.main.users);
    const map = useRef();

    const [currentCoordinates, setCurrentCoordinates] = useState(null);

    useEffect(()=> {
        if (currentUser.location) {
            if (!currentUser) {
            setCurrentCoordinates({
                lat: currentUser.location.latitude,
                lng: currentUser.location.longitude,
            });
            }
            map.current.animateToRegion({ // Takes a region object as parameter
                latitude: currentUser.location.latitude,
                longitude: currentUser.location.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
            },1000);
        }
    }, [currentUser, map.current]);

    if (!currentUser || !currentUser.location) {
        return null;
    }

    return (
        <MapView
            ref={map}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={SilverMapStyleData}
            region={currentCoordinates && {
                latitude: currentCoordinates.lat,
                longitude: currentCoordinates.lng,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
            }}
        >

            {users.map(user => {
                if (!user.location) {
                    return null;
                }

                const isCurrentUser = user.username === currentUser.username;

                return (
                    <Marker
                        coordinate={{
                            latitude: user.location.latitude,
                            longitude: user.location.longitude,
                        }}
                        onPress={()=> {
                            dispatch(MainState.setFocusedUser(user));
                        }}
                    >
                        <View style={{
                            flexDirection: 'column',
                            borderRadius: 20,
                            width: 40,
                            height: 40,
                            overflow: "hidden",
                            borderWidth: 2,
                            borderColor: isCurrentUser ? '#0003' :'#20F5',
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                        }}>
                            <Svg
                                width={36}
                                height={36}>
                                <Image
                                    href={`https://ui-avatars.com/api/?name=${user.username}&color=7F9CF5&background=EBF4FF&size=256`}
                                    width={36}
                                    height={36}
                                />
                            </Svg>
                        </View>
                    </Marker>
                )
            })}

        </MapView>
    )
}
