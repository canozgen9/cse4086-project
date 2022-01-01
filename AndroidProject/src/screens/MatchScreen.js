import React, {useEffect} from "react";
import {Box, Button, Card, Center, Flex, Heading, HStack, Text, VStack} from "native-base";
import {XMap} from "../components/x-map/XMap";
import {useDispatch, useSelector} from "react-redux";
import Geolocation from "react-native-geolocation-service";
import {SocketState} from "../services/store/socket/SocketActions";
import {View} from "react-native";
import {MainState} from "../services/store/reducers/MainReducer";

export const MatchScreen = ({navigation})=> {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.main.user);
    const users = useSelector(state => state.main.users);
    const focusedUser = useSelector(state => state.main.focusedUser);
    const call = useSelector(state => state.main.call);


    useEffect(()=> {

        if (call && call.status && call.status === 'accepted') {
            navigation.navigate('Call');
        }
    }, [call]);

    useEffect(()=> {
        (async ()=> {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log('current',position);
                   dispatch( SocketState.emit("location.update", {
                       location: position.coords
                   }));
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );

            Geolocation.watchPosition((position)=> {
                console.log('watch',position);
                dispatch(SocketState.emit("location.update", {
                    location: position.coords
                }));
            }, (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            }, {
                interval: 1,
                enableHighAccuracy: true,
            })
        })();
    }, []);

    return (
        <View style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
        }}>
            <View style={{
                flex: 1,
                width: '100%',
            }}>
                <XMap/>
            </View>

            {call ? (
                <View style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '100%',
                    padding: 8
                }}>
                    <Box
                        width={"100%"}
                        height={"100%"}
                        rounded="lg"
                        overflow="hidden"
                        borderColor="coolGray.200"
                        borderWidth="1"
                        backgroundColor="gray.50"
                        padding={2}
                    >


                        {call.to === currentUser.username ? (
                            <Center style={{
                                width: '100%',
                                height: '100%',
                            }}>
                            <View>
                                <Text>{call.from} is calling...</Text>
                            </View>


                                <Text>{call.status}</Text>


                                {call.status === 'requesting' && (


                                <HStack space={4} alignItems="center">
                                    <Button style={{
                                        flex: 1
                                    }} onPress={()=> {
                                        dispatch(SocketState.emit("call.accept", {
                                            from: call.from
                                        }));
                                    }}>
                                        Accept
                                    </Button>
                                    <Button style={{
                                        flex: 1
                                    }} onPress={()=> {
                                        dispatch(SocketState.emit("call.decline", {
                                            from: call.from
                                        }));
                                    }}>
                                        Decline
                                    </Button>
                                </HStack>
                                )}


                            </Center>
                        ) : (
                            <Center style={{
                                width: '100%',
                                height: '100%',
                            }}>
                            <View>
                                <Text>Calling {call.to}...</Text>
                            </View>

                                <Text>{call.status}</Text>

                                {call.status === 'requesting' && (

                                    <HStack space={4} alignItems="center">
                                    <Button style={{
                                        flex: 1
                                    }} onPress={()=> {
                                        dispatch(SocketState.emit("call.cancel", {
                                            to: call.to
                                        }));
                                    }}>
                                        Cancel
                                    </Button>
                                </HStack>
                                )}

                            </Center>
                        )}

                    </Box>
                </View>
            ): <>



            {focusedUser && (

                <View style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                    height: 128,
                    width: '100%',
                    padding: 8
            }}>
                    <Box
                        rounded="lg"
                        overflow="hidden"
                        borderColor="coolGray.200"
                        borderWidth="1"
                        backgroundColor="gray.50"
                        padding={2}
                    >

                    <VStack space={4}>

                        <VStack space={4}>
                            <Text>{focusedUser.username}</Text>
                        </VStack>

                        <HStack space={4} alignItems="center">
                            <Button style={{
                                flex: 1
                            }} onPress={()=> {
                                dispatch(SocketState.emit("call.initiate", {
                                    to: focusedUser.username
                                }))
                            }}>
                                Call
                            </Button>
                            <Button onPress={()=> {
                                dispatch(MainState.setFocusedUser(null))
                            }}>
                                Close
                            </Button>
                        </HStack>
                    </VStack>

                </Box>

            </View>
            )}
            </>}



        </View>
    )
}
