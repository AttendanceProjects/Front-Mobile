import React, { useState, useEffect } from 'react';
import { View, Platform, AsyncStorage, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraComponent, ErrorCheckInOutComponent, ErrorCameraComponent, LoadingCheckInOutComponent, SuccessCheckInOutComponent } from '../../components';
import { getAccess, uploadImage, checkConnection } from '../../service';
import { takeAPicture, _checkLocation, _getCurrentLocationOffline, _getLocationBeforeAbsent } from '../../helpers';
import { Mutation, Query } from '../../graph';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { getDistance } from 'geolib';


export const CheckOutComponent = ({ navigation }) => {
  const [ hasPermission, setHasPermission ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ success, setSuccess ] = useState( false );
  const [ camera, setCamera ] = useState( false );
  const [ gif, setGif ] = useState( {} );
  const [ type ] = useState(Camera.Constants.Type.front);

  const [ checkout ] = useMutation( Mutation.CHECK_OUT_ATT );
  const [ checkoutLocation ] = useMutation( Mutation.UPDATE_LOCATION );
  const [ failed ] = useMutation( Mutation.FAIL_PROCESS );

  const [ getCompany, { data: company } ] = useLazyQuery( Query.GET_COMPANY );
  const [ parameter, setParameter ] = useState( false );

  useEffect(() => {
    (async () => {
      const { code, token } = await getAccess();
      const { id, issues } = await navigation.state && navigation.state.params
      await setParameter({ id, issues })
      if( code && token ) {
        const { status } = await Camera.requestPermissionsAsync();
        if( status === 'granted' ) {
          setHasPermission(status === 'granted');
          try {
            await getCompany({ variables: { code, token } })
          }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); _onClear( setMessage ); }
        }
        else if( status !== 'granted' && !loading ) setMessage( 'Please set allow your camera to access this application');
      }
    })();
  }, []);

  const _onClear = meth => setTimeout(() => meth( false ), 3000)

  const takePicture = async () => {
    if( camera ) {
      const { network } = await checkConnection();
      const { id: attId, issues } = parameter;
      if( network ) {
        const { code, token } = await getAccess();
        if( company && company.getCompany && company.getCompany.location && company.getCompany.location.longitude && company.getCompany.location.latitude ) {
          const { longitude, latitude, error } = await _getLocationBeforeAbsent();
          const { longitude: compLongitude, latitude: compLatitude } = company.getCompany.location;
          if ( error )  Alert.alert("Warning", error);
          else {
            const dist = getDistance(
              { latitude: latitude, longitude: longitude },
              { latitude: compLatitude ? compLatitude : -6.157771, longitude: compLongitude ? compLongitude : 106.819315 } //---------- LOCATION COMPANY 106.81931855395794 -6.157839617035091
            )
            const calculate = dist * 84000;
            if( calculate < 700000 ){
              try {
                const { message } = await takeAPicture({ access: { code, token }, upload: uploadImage, camera, loading: setLoading, message: setMessage, action: { mutation: checkout }, gifLoad: setGif, type: { msg: 'checkout', id: attId, daily: Query.GET_DAILY_USER } });
                if( message ) {
                  setGif({ uri: 'https://media.giphy.com/media/VseXvvxwowwCc/giphy.gif', first: 'Please Wait...', second: "Checking Location..." })
                  await _checkLocation({ nav: navigation.navigate, id: attId, osPlatform: Platform.OS, action: { upFailed: failed, updateLocation: checkoutLocation, query: Query.USER_ATT, daily: Query.GET_DAILY_USER,  history: Query.GET_HISTORY }, type: 'checkout', notif: { gif: setGif, msg: setSuccess }, access: { code, token }, reason: issues ? issues : '' })
                }else setMessage( 'something error, please try again' );
              } catch(err) {
                setMessage( err );
                await failed({ code, token, id })
                setTimeout(() => {
                  navigation.navigate( 'Home' );
                  setLoading( false );
                }, 6000)
              }
            }else Alert.alert('Warning', 'You are out of range, please approach the company area' );
          }
        }else{
          Alert.alert('Whoops', 'something error, try again',[
            { text: 'No' },
            { text: 'Yes', onPress: _ => takePicture() }
          ])
        }
      }else {
        const picture = await camera.takePictureAsync({ quality: 0.5 });
        const { coords } = await _getCurrentLocationOffline();
        let IndoTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
        const res = await AsyncStorage.getItem( 'offline' );
        if( res ) await AsyncStorage.removeItem( 'offline' );
        else{
          await AsyncStorage.setItem('offline', JSON.stringify({
            location: {
              longitude: coords.longitude,
              latitude: coords.latitude,
              accuracy: coords.accuracy
            },
            url: picture.uri,
            time: new Date( IndoTime ) ,
            type: 'checkout',
            id
          }));
          const splitPicture = picture.uri.split('-');
          setMessage( `No Internet Connection, but we are still processing your request.. Please screen shot and upload if you done connected internet ${ splitPicture[splitPicture.length-1] } for Correction`);
          setTimeout(() => {
            setMessage( false );
            navigation.navigate( 'LiveAtt' );
          }, 20000)   
        }
      }
    }
  }


  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <ErrorCameraComponent text={ 'Please Allow your Camera' } type={ 'nocamera' } />
  }


  return (
    <View style={{ flex: 1 }}>
      { message && !loading && !success
          ? <ErrorCheckInOutComponent text={ message }/>
          : null }
      { !message && success
          ? <SuccessCheckInOutComponent text={ 'checkout' } />
          : null }
      { loading && !success && !message
          ? <LoadingCheckInOutComponent gif={{ image: gif.uri && gif.uri, w: 250, h: 250 }}  text={{ first: gif.first && gif.first, second: gif.second && gif.second }} bg={ 'black' }/>
          : <CameraComponent setCamera={ setCamera } takePicture={ takePicture } type={ type } /> }
    </View>
  )
}