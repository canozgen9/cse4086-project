import React, {useState} from "react";
import {Box, Button, Center, FormControl, Heading, HStack, Input, Text, View, VStack} from "native-base";
import {useDispatch} from "react-redux";
import {SocketState} from "../services/store/socket/SocketActions";

export const LoginScreen = ({navigation})=> {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [isLoading, setLoading] = useState(false);
    const onUsernameChange = (text) => setUsername(text);

    return (
        <Center flex={1}>
                <Box safeArea p="2" py="8" w="90%" maxW="400">
                    <Heading
                        size="lg"
                        fontWeight="600"
                        color="coolGray.800"
                        _dark={{
                            color: "warmGray.50",
                        }}
                    >
                        Welcome
                    </Heading>
                    <Heading
                        mt="1"
                        _dark={{
                            color: "warmGray.200",
                        }}
                        color="coolGray.600"
                        fontWeight="medium"
                        size="xs"
                    >
                        Login to continue!
                    </Heading>

                    <VStack space={3} mt="5">
                        <FormControl >
                            <FormControl.Label>Username</FormControl.Label>
                            <Input isDisabled={isLoading} value={username} onChangeText={onUsernameChange}  />
                        </FormControl>
                        <Button mt="2" isLoading={isLoading} onPress={()=> {
                            dispatch(SocketState.emit("login", {username: username}, (result) => {
                                if(result.status === "ok") {
                                    navigation.navigate("Match");
                                } else {
                                    console.error(JSON.stringify(result));
                                }
                            }));
                        }}>
                            Login
                        </Button>
                    </VStack>
                </Box>
        </Center>
    )
}
