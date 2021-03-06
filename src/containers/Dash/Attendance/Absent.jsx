import React, { useState, useEffect } from 'react';
import { Text, View, Platform, AsyncStorage, Alert, ActivityIndicator } from 'react-native';
import { ErrorCheckInOutComponent, LoadingCheckInOutComponent, CameraComponent, SuccessCheckInOutComponent } from '../../../components';
import { Camera } from 'expo-camera';
import { takeAPicture, _checkLocation, _getCurrentLocationOffline, _getLocationBeforeAbsent } from '../../../helpers';
import { getAccess, uploadImage, checkConnection, getServerTime } from '../../../service';
import { Mutation, Query } from '../../../graph';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { getDistance } from 'geolib'

export const Absent = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.front);
  const [ message, setMessage ] = useState( false );
  const [ success, setSuccess ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ gif, setGif ] = useState( {} );
  const [ camera, setCamera ] = useState( '' );
  const [ distanceLoading, setDistanceLoading ] = useState( false );
  const [ attendance ] = useMutation( Mutation.CREATE_ATT );
  const [ location ] = useMutation( Mutation.UPDATE_LOCATION );
  const [ failed ] = useMutation( Mutation.FAIL_PROCESS );
  const [ getCompany, { data: company } ] = useLazyQuery( Query.GET_COMPANY );
  const [ access, setAccess ] = useState( false );

  useEffect(() => {
    (async () => {
      const { code, token } = await getAccess();
      if( code && token ) {
        setAccess({ code, token });
        const { status } = await Camera.requestPermissionsAsync();
        if( status === 'granted' ) {
          setHasPermission(status === 'granted')
          try {
            await getCompany({ variables: { code, token } })
          }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); _onClear( setMessage ); }
        }
        else if( status !== 'granted' && !loading ) setMessage( 'Please set allow your camera to access this application');
      }else{
        navigation.navigate( 'Signin' );
      }
    })();
  }, []);


  const _onClear = meth => setTimeout(() => meth( false ), 3000)

  const takePicture = async () => {
    let id
    if( camera ) {
      const { network } = await checkConnection();
      if( network ) {
        const { code, token } = await access;
        const { time, error } = await getServerTime({ code, token });
        const { startReason } =  navigation.state.params ? await navigation.state.params : '';
        if( (time.split(':')[0] < 8 && time.split(' ')[1] === 'AM') || startReason ){
          if( Platform.OS === 'ios' ){
            setDistanceLoading( true );
          }
          if( company && company.getCompany && company.getCompany.location && company.getCompany.location.longitude && company.getCompany.location.latitude ) {
            const { longitude, latitude, error } = await _getLocationBeforeAbsent();
            const { longitude: compLongitude, latitude: compLatitude } = company.getCompany.location
            if( error ) {
              Alert.alert('Warning', error );
              setDistanceLoading( false );
            }
            else {
              const dist = getDistance(
                { latitude: latitude, longitude: longitude },
                { latitude: compLatitude ? compLatitude : -6.157771, longitude: compLongitude ? compLongitude : 106.819315 }
              )
              const calculate = dist * 84000;
              if( calculate < 700000 ) {
                setDistanceLoading( false );
                try {
                  let { message, id } = await takeAPicture({ access: { code, token }, start_reason: startReason ? startReason : '', upload: uploadImage, camera, loading: setLoading, message: setMessage, action: { mutation: attendance, query: Query.USER_ATT, daily: Query.GET_DAILY_USER, history: Query.GET_HISTORY, }, gifLoad: setGif, type: { msg: 'checkin' } });
                  if( message && id ) {
                    setGif({ uri: 'https://media.giphy.com/media/VseXvvxwowwCc/giphy.gif', first: 'Please Wait...', second: "Checking Location..." })
                    await _checkLocation({ nav: navigation.navigate, id, osPlatform: Platform.OS, action: { upFailed: failed, updateLocation: location, daily: Query.GET_DAILY_USER, }, type: 'checkin', notif: { gif: setGif, msg: setSuccess }, access: { code, token } })
                    setLoading( false );
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
              }else {
                Alert.alert('Warning', 'You are out of range, please approach the company area')
                setDistanceLoading( false );
              }
            }
          }else{
            setDistanceLoading( false );
            Alert.alert('Woops', 'something error, try again',[
              { text: 'No' },
              { text: 'Yes', onPress: _ => takePicture() }
            ])
          }
        }else if( !network ) {
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
        }else {
          Alert.alert('Warning', 'You are late, give us reason by click "checkin" in dashboard', [ {text: 'Oke', onPress: () => navigation.navigate( 'LiveAtt' ) } ] );
        }
      }
    }else if( error ){
      Alert.alert('Warning', 'Something wrong when take time from server, please try again', [ {text: 'Oke', onPress: () => navigation.navigate( 'Absent' ) } ] );
    }
  }


  if (hasPermission === null) {
    return <View><Text style={{ color: 'white', fontWeight: 'bold' }}>No Permission</Text></View>;
  }
  if (hasPermission === false) {
    return <Text style={{ color: 'white', fontWeight: 'bold' }}>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      { distanceLoading
          ?  <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color='white' size='large' />
              </View> : null }
      { message && !distanceLoading
          ? <ErrorCheckInOutComponent text={ message }/>
          : null }
      { !message && success && !distanceLoading && !loading
            ? <SuccessCheckInOutComponent text={ 'checkin' } />
            : null }
      { loading && !distanceLoading
                ? <LoadingCheckInOutComponent gif={{ image: gif.uri && gif.uri, w: 250, h: 250 }}  text={{ first: gif.first && gif.first, second: gif.second && gif.second }} bg={ 'black' }/>
                : <CameraComponent setCamera={ setCamera } takePicture={ takePicture } type={ type }/> }
    </View>
  );
}