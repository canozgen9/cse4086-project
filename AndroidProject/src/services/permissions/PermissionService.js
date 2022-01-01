import {PermissionsAndroid} from "react-native";

export default class PermissionService {
    static async ensurePermissions() {
        await this.ensureCameraPermission();
        await this.ensureMicrophonePermission();
        await this.ensureLocationPermission();
    }

    static async ensureCameraPermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "Cool Photo App Location Permission",
                message: "Cool Photo App needs access to your location ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            throw new Error("Camera permission denied");
        }
    }

    static async ensureMicrophonePermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: "Cool Photo App Location Permission",
                message: "Cool Photo App needs access to your location ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            throw new Error("Camera permission denied");
        }
    }

    static async ensureLocationPermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Cool Photo App Location Permission",
                message: "Cool Photo App needs access to your location ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            throw new Error("Camera permission denied");
        }
    }
}
