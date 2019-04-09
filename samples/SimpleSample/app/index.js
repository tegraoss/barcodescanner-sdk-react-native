import React, { Component } from 'react';
import {
  AppRegistry,
  AppState,
  StyleSheet,
  Text,
  findNodeHandle,
  View,
  Platform,
  PermissionsAndroid,
  BackHandler
} from 'react-native';
import {
  BarcodePicker,
  ScanditModule,
  ScanSession,
  Barcode,
  SymbologySettings,
  ScanSettings
} from 'scandit-react-native';

ScanditModule.setAppKey('Ace8aa2BOQmwL4B3nAm1l9IgknlWGPYBBRcydaVW5RSwT8m+bXh+sglLBGy4c2+dKEYOKtZrUo/gcKbBD1Z9gQN8ZLLkXHOdsB7fgpMv1qaPYbX/IRB7G5I5AnKMByw0Z8zvHZmlVAWRW+s67V0tpt2TVQrJMAM9SHxLIYk/H/7U6ydTyslraal+beXHLXBwaJeJm04mP9Jl8v9+DpakgSbLUSPdHDkK4D24OzOVrZrtxjCw7MimrqTwbZq9T9hm0YWRMEeIHqo8NzGMqInbuCVBEgj39QXj/q7l4oS3utgTMta66qHRWpbndkq+EsdibWHmuLsfZZ3EAOp1szg+aYyf+XYW8zGljhqTK+8YmVLexTzTMcwU5F6wsROEvB3R0gYl6fn83LAIz0n20TiOfdsOAoXac5bjUN7KMsnPSih7YqLFngJc/603C3+NWPCN1gn/FZSwaQHW236O+eLryJ7AoV8C4t7Uc5a4xghCz0s2XX+472jvpokjJODGbUoiIoz6VzwRCj4Wbc/C9aDVaelE52Q8EXwo0eP+XnCWIH+/W1jNIvHljJdFRXUQG7s9TWvIxIGYZzKWN67oEmT8bLtzMr8qs5d5kwigFQAjeUecORmpJjV3pRRP3/GdJ7zDgS12ftxWXD4g1SqHJFV6K3h2LkIdlK0E8JAG/jD2SaYk5QHnRHrctDelJcQzG0XDiBESykwOcK9zSe3jxFsHf1ewNvMCQ0S6QKvyUxOGmWe5OmgFAJgSPowH3vBoyN0ze/cyJc8tnTpxSKtEzxCFgrAdApQLd0D3cKD5DVW1GhM=');

export default class SimpleSample extends Component {

  componentWillMount() {
    this.settings = new ScanSettings();
    this.settings.setSymbologyEnabled(Barcode.Symbology.EAN13, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.EAN8, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.UPCA, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.UPCE, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.CODE39, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.ITF, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.QR, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.DATA_MATRIX, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.CODE128, true);

    /* Some 1d barcode symbologies allow you to encode variable-length data. By default, the
       Scandit BarcodeScanner SDK only scans barcodes in a certain length range. If your
       application requires scanning of one of these symbologies, and the length is falling
       outside the default range, you may need to adjust the "active symbol counts" for this
       symbology. This is shown in the following few lines of code. */
    this.settings.getSymbologySettings(Barcode.Symbology.CODE39)
      .activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    /* For details on defaults and how to calculate the symbol counts for each symbology, take
       a look at http://docs.scandit.com/stable/c_api/symbologies.html. */
  }

  isAndroidMarshmallowOrNewer() {
    return Platform.OS === 'android' && Platform.Version >= 23;
  }

  async hasCameraPermission() {
    if (this.isAndroidMarshmallowOrNewer()) {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      return granted;
    } else {
      return true;
    }
  }

  async requestCameraPermission() {
    if (this.isAndroidMarshmallowOrNewer()) {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Android Camera Permission has been granted.");
          this.cameraPermissionGranted();
        } else {
          console.log("Android Camera Permission has been denied - the app will shut itself down.");
          this.cameraPermissionDenied();
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      this.cameraPermissionGranted();
    }
  }

  // This method should only be called if the Platform.OS is android.
  cameraPermissionDenied() {
    BackHandler.exitApp();
  }

  cameraPermissionGranted() {
    this.scanner.startScanning();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  async componentDidMount() {
    const hasPermission = await this.hasCameraPermission();
    if (hasPermission) {
      this.cameraPermissionGranted();
    } else {
      await this.requestCameraPermission();
    }
  }
  
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  
  _handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      this.scanner.stopScanning();
    } else {
      this.scanner.startScanning();
    }
  }

  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column'}}>
        <BarcodePicker
          onScan={(session) => { this.onScan(session) }}
          scanSettings= { this.settings }
          ref={(scan) => { this.scanner = scan }}
          style={{ flex: 1 }}/>
      </View>
    );
  }

  onScan(session) {
    alert(session.newlyRecognizedCodes[0].data + " " + session.newlyRecognizedCodes[0].symbology);
  }

}
