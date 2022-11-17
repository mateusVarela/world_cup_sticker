import { useState, useEffect, useRef } from 'react';
import { Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Text, View } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing'

import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';

export function Home() {
  const [photo, setPhotoURI] = useState<null | string>(null);
  const [hasCamerapermission, setHasCameraPermission] = useState(false)
  const [positionSelected, setPositionSelected] = useState<PositionProps>(POSITIONS[0]);

  const screenShotRef = useRef(null)
  const cameraRef = useRef<Camera>(null)

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync()
    setPhotoURI(photo.uri)
  }

  async function shareScreenshot() {
    const screenShot = await captureRef(screenShotRef)
    await Sharing.shareAsync('file://'+ screenShot)
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(response => {
      setHasCameraPermission(response.granted)
    })
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View ref={screenShotRef} style={styles.sticker}>
          <Header position={positionSelected} />

          <View style={styles.picture}>
            { hasCamerapermission && !photo? 
              <Camera 
                ref={cameraRef}
                style={styles.camera}
                type={CameraType.front}
              /> :
              <Image 
                source={{ uri: photo ? photo :'data:image/png;base64,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' }} 
                style={styles.camera} 
                onLoad={shareScreenshot}
              />
            }
            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <TouchableOpacity onPress = {() => setPhotoURI(null)}>
          <Text style={styles.retry}>
            Nova Foto
          </Text>
        </TouchableOpacity>

        <Button title="Compartilhar" onPress={handleTakePicture}/>
      </ScrollView>
    </SafeAreaView>
  );
}