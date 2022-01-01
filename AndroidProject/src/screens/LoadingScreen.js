import React, {useEffect} from "react";
import {Center, Heading, View, VStack} from "native-base";

export const LoadingScreen = ({navigation})=> {
    useEffect(()=> {
        const timeout = setTimeout(()=> {
            navigation.navigate("Login");
        }, 1000);

        return ()=> {
          clearTimeout(timeout);
        };
    },[]);

    return (
        <Center flex={1}>
            <VStack space={4} alignItems="center">
            <Heading>Loading</Heading>
            </VStack>
        </Center>
    )
}
