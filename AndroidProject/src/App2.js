import React, {useEffect} from 'react';
import { Provider } from "react-redux";
import {NativeBaseProvider, Box, Container, VStack, Center, Flex, extendTheme, Heading} from 'native-base';
import Geolocation from 'react-native-geolocation-service';
import PermissionService from "./services/permissions/PermissionService";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {LoginScreen} from "./screens/LoginScreen";
import {LoadingScreen} from "./screens/LoadingScreen";
import {MatchScreen} from "./screens/MatchScreen";
import store from "./services/store";
import {CallScreen} from "./screens/CallScreen";

const Stack = createNativeStackNavigator();

export default function App() {

    useEffect(()=> {

        (async ()=> {
            await PermissionService.ensurePermissions();


        })();


    }, []);

    return (
        <Provider store={store}>
            <NativeBaseProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Loading"  screenOptions={{
                        headerShown: false
                    }}>
                        <Stack.Screen name="Loading" component={LoadingScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Match" component={MatchScreen} />
                        <Stack.Screen name="Call" component={CallScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </NativeBaseProvider>
        </Provider>
    );
}
