import React,{useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView} from 'react-native-webrtc';
import {StyleSheet,Button, SafeAreaView, View} from "react-native";
import {IconButton} from "native-base";
import Svg, {Image} from "react-native-svg";
import {SocketState} from "../services/store/socket/SocketActions";
import EventBus from "../services/events/EventBus";

const pcConfig = {
    "iceServers": [
        {
            "url": "stun:stun.l.google.com:19302"
        },
        {
            "url": "stun:stun1.l.google.com:19302"
        },
        {
            "url": "stun:stun2.l.google.com:19302"
        },
        {
            "url": "stun:stun3.l.google.com:19302"
        },
        {
            "url": "stun:stun4.l.google.com:19302"
        },
        {
            "urls": "turn:144.91.103.212:3478",
            "username": "chat",
            "credential": "123456"
        }
    ]
};

export const CallScreen = ()=> {
    const dispatch = useDispatch();
    const user = useSelector(state => state.main.user);
    const call = useSelector(state => state.main.call);

    const otherUsername = call.from === user.username ? call.to : call.from;

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setMuted] = useState(false);
    const [isStarted, setStarted] = useState(false);
    const [isInitiator] = useState(call.from === user.username);


    useEffect(()=> {
        if (!localStream) return;
        if (isStarted) return;

        let pc;


        const handleMessage = (message) => {
            console.log("message received!", message);
            if (message.type === 'offer') {
                if (!isInitiator && !isStarted) {
                    startCall();
                }
                pc.setRemoteDescription(new RTCSessionDescription(message));
                pc.createAnswer().then(setLocalAndSendMessage, onCreateSessionDescriptionError);
            } else if (message.type === 'answer' && isStarted) {
                pc.setRemoteDescription(new RTCSessionDescription(message));
            } else if (message.type === 'candidate' && isStarted) {
                const candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.sdpMLineIndex,
                    candidate: message.candidate,
                    sdpMid: message.sdpMid,
                });
                pc.addIceCandidate(candidate);
            }
        };

        EventBus.subscribe("signaling", handleMessage);

        const sendMessage = (message) => {
            dispatch(SocketState.emit("signaling", {
                to: otherUsername,
                message: message,
            }, null));
        };

        const startCall = async () => {
            if (!isStarted && localStream && !pc) {
                pc = new RTCPeerConnection(pcConfig);

                console.log("creating pc " + isInitiator);

                pc.onicecandidate = onIceCandidate;
                pc.onaddstream = onAddStream;

                pc.addStream(localStream);

                setStarted(true);

                if (isInitiator) {
                    let offer = await pc.createOffer();
                    setLocalAndSendMessage(offer)
                }
            }
        };

        const onIceCandidate = (e) => {
            console.log('icecandidate event: ', e);

            if (e.candidate) {
                sendMessage({
                    type: 'candidate',
                    sdpMLineIndex: e.candidate.sdpMLineIndex,
                    sdpMid: e.candidate.sdpMid,
                    candidate: e.candidate.candidate
                });
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('End of candidates.');
                }
            }
        }

        const onAddStream = (event) => {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Remote stream added.', event);
            }
            // this.remoteVideo.srcObject = event.stream;
          setRemoteStream(event.stream);
        };

        const setLocalAndSendMessage = (sessionDescription) => {
            console.log('setLocalAndSendMessage sending message', sessionDescription);
            pc.setLocalDescription(sessionDescription);
            sendMessage(sessionDescription);
        };

        const handleCreateOfferError = (error) => {
            console.error('createOffer() error: ', error);
        };

        const onCreateSessionDescriptionError = (error) => {
            console.error('Failed to create session description: ' + error.toString());
        };

        startCall();

    }, [localStream]);

    useEffect(()=> {
        const getLocalStream =  async () => {
            // isFront will determine if the initial camera should face user or environment
            const isFront = true;
            const devices = await mediaDevices.enumerateDevices();

            const facing = isFront ? 'front' : 'environment';
            const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
            const facingMode = isFront ? 'user' : 'environment';
            const constraints = {
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 500, // Provide your own width, height and frame rate here
                        minHeight: 300,
                        minFrameRate: 30,
                    },
                    facingMode,
                    optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
                },
            };
            return await mediaDevices.getUserMedia(constraints);
        };

        (async ()=> {
            setLocalStream(await getLocalStream());
        })();

    }, []);

    const switchCamera = ()=> {
        localStream.getVideoTracks().forEach(track => track._switchCamera());
    };

    const toggleMute = ()=> {
        if (!remoteStream) return;
        localStream.getAudioTracks().forEach(track => {
            console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
            track.enabled = !track.enabled;
            setMuted(!track.enabled);
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flex: 1,
                width: '100%',
                height: '100%',
                position: "absolute",
                left: 0,
                bottom: 0,
                top: 0,
            }}>
                {remoteStream && <RTCView style={styles.rtc} streamURL={remoteStream.toURL()}/>}
            </View>

            <View style={{
                position: "absolute",
                right: 16,
                bottom: 16,
                width: 100,
                height: 120,
                borderRadius: 4,
                overflow: "hidden",
                borderWidth: 2,
                borderColor: '#FFF2',
            }}>
                {localStream && <RTCView style={styles.rtc} streamURL={localStream.toURL()}/>}
            </View>

            {localStream && (
                <View style={{
                    position: "absolute",
                    left: 8,
                    top: 8,
                    display: "flex",
                    flexDirection: "row",
                }}>

                    <IconButton icon={<Svg
                        width={24}
                        height={24}>
                        <Image
                            href={`https://iconsplace.com/wp-content/uploads/_icons/ffffff/256/png/switch-camera-icon-18-256.png`}
                            width={24}
                            height={24}
                        />
                    </Svg>} onPress={switchCamera}/>

                    <IconButton
                        title={`${isMuted ? 'Unmute' : 'Mute'} stream`}
                        icon={<Svg
                        width={24}
                        height={24}
                        isDisabled={!remoteStream}
                        >
                        <Image
                            href={`https://icon-library.com/images/mute-icon-png/mute-icon-png-21.jpg`}
                            width={24}
                            height={24}
                        />
                    </Svg>} onPress={toggleMute}/>
                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    text: {
        fontSize: 30,
    },
    rtcview: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        backgroundColor: 'black',
    },
    rtc: {
        width: '100%',
        height: '100%',
    },
    toggleButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
