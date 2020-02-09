import React, { useState, useEffect } from 'react';
import { Text, View, Platform, AsyncStorage, Alert } from 'react-native';
import { ErrorCheckInOutComponent, LoadingCheckInOutComponent, CameraComponent, SuccessCheckInOutComponent } from '../../components/Spam';
import { Camera } from 'expo-camera';
import { takeAPicture, _checkLocation, _getCurrentLocationOffline } from '../../helpers';
import { getAccess, uploadImage, checkConnection, getServerTime } from '../../service';
import { Mutation, Query } from '../../graph';
import { useMutation } from '@apollo/react-hooks';

export const Absent = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.front);
  const [ message, setMessage ] = useState( false );
  const [ success, setSuccess ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ gif, setGif ] = useState( {} );
  const [ camera, setCamera ] = useState( '' );
  const [ isOnline, setIsOnline ] = useState( true );

  const [ attendance ] = useMutation( Mutation.CREATE_ATT );
  const [ location ] = useMutation( Mutation.UPDATE_LOCATION );
  const [ failed ] = useMutation( Mutation.FAIL_PROCESS );


  useEffect(() => {
    (async () => {
      await checkConnection({ save: setIsOnline });
      const { status } = await Camera.requestPermissionsAsync();
      if( status === 'granted' ) setHasPermission(status === 'granted');
      else if( status !== 'granted' && !loading ) setMessage( 'Please set allow your camera to access this application');
    })();
  }, []);

  const takePicture = async () => {
    const { code, token } = await getAccess();
    const { time, error } = await getServerTime({ code, token });
    const { startReason } =  navigation.state.params ? await navigation.state.params : '';
    if( time.split(':')[0] < 8 && time.split(' ')[1] === 'AM' || startReason ){
      let id
      if( camera ) {
        await checkConnection({ save: setIsOnline });
        if( isOnline ) {
          try {
            let { message, id } = await takeAPicture({
              access: { code, token },
              start_reason: startReason ? startReason : '',
              upload: uploadImage,
              camera,
              loading: setLoading,
              message: setMessage,
              action: { 
                mutation: attendance,
                query: Query.USER_ATT,
                daily: Query.GET_DAILY_USER,
                history: Query.GET_HISTORY,
                // filter: Query.FILTER_ATT
              },
              gifLoad: setGif,
              type: { msg: 'checkin' } 
            });
            console.log( 'checkin success', message );
            if( message && id ) {
              setGif({ uri: 'https://media.giphy.com/media/VseXvvxwowwCc/giphy.gif', first: 'Please Wait...', second: "Checking Location..." })
              const { msg } = await _checkLocation({
                nav: navigation.navigate,
                id,
                osPlatform: Platform.OS,
                action: {
                  upFailed: failed,
                  updateLocation: location,
                  // query: Query.USER_ATT,
                  daily: Query.GET_DAILY_USER,
                  // history: Query.GET_HISTORY,
                  // filter: Query.FILTER_ATT
                },
                type: 'checkin',
                notif: { gif: setGif, msg: setSuccess },
                access: { code, token }
              })
              console.log( 'check location', msg );
            }else {
              setMessage( 'something error' );
              setTimeout(() => { setLoading( false ); navigation.navigate( 'LiveAtt' ) }, 5000);
            }
          } catch(err) {
            setMessage( err );
            await failed({ code, token, id })
            setTimeout(() => {
              navigation.navigate( 'Home' );
              setLoading( false );
            }, 6000)
          }
        }else{
          const picture = await camera.takePictureAsync({ quality: 0.5 });
          const { coords } = await _getCurrentLocationOffline();
          let IndoTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
          await AsyncStorage.setItem('offline', JSON.stringify({
            location: {
              longitude: coords.longitude,
              latitude: coords.latitude,
              accuracy: coords.accuracy
            },
            url: picture.uri,
            time: new Date( IndoTime ) ,
            type: 'checkin'
          }));
          const splitPicture = picture.uri.split('-');
          setMessage( `No Internet Connection, but your request will our keep.. Please screen shot this and upload if you done connected internet ${ splitPicture[splitPicture.length-1] }`);
          setTimeout(() => {
            setMessage( false );
            navigation.navigate( 'LiveAtt' );
          }, 20000)
        }
      }
    }else if( error ){
      Alert.alert('Warning', 'Something wrong when take time from server, please try again', [ {text: 'Oke', onPress: () => navigation.navigate( 'Absent' ) } ] );
    }else {
      Alert.alert('Warning', 'You are late, give us reason by click "checkin" in dashboard', [ {text: 'Oke', onPress: () => navigation.navigate( 'LiveAtt' ) } ] );
    }
  }


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {
        message 
          ? 
            <View style={{ flex: 1 }}>
              <ErrorCheckInOutComponent text={ message }/>
            </View>
          : !message && success
            ? <View style={{ flex: 1 }}>
                <SuccessCheckInOutComponent text={ 'chechin' } />
              </View>
              : loading
                ? <LoadingCheckInOutComponent gif={{ image: gif.uri, w: 250, h: 250 }}  text={{ first: gif.first, second: gif.second }} bg={ 'black' }/>
                : <CameraComponent setCamera={ setCamera } takePicture={ takePicture } type={ type }/>
      }
    </View>
  );
}