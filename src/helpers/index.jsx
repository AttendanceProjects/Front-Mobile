import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

// -6.132331, 106.808560
export const takeAPicture = ({ camera, type, action, loading, message, gifLoad, upload, access }) => {
  return new Promise ( async (resolve, reject ) => {
    const { uri } = await camera.takePictureAsync();
    const { code, token } = access;
    if( uri ) {
      loading( true );
      gifLoad({ uri: 'https://media.giphy.com/media/xT9DPldJHzZKtOnEn6/giphy.gif', first: 'Please Wait...', second: type.msg === 'checkout' ? 'Process Check Out' : 'Process Check In' })
      const formData = new FormData();
      formData.append( 'image', { name: `${ type.msg }.jpg`, type: 'image/jpg', uri })
      const { success, error } = await upload({ code, token, formData });
      if( success ) {
        try {
          if( type.msg === 'checkin' ) {
            const { data } = await action.mutation({ variables: { code, token, start_image: success } });
            loading( false );
            message( false );
            gifLoad( {} );
            resolve({ message: 'success', id: data.createAtt._id })
          }
          else if ( type.msg === 'checkout' ) {
            console.log( type.id );
            const { data } = await action.mutation({ variables: { code, token, end_image: success, id: type.id }, refetchQueries: [ {query: type.query, variables: {code, token}}, {query: type.daily, variables: {code, token}} ] });
            console.log( data, 'after update' );
            loading( false );
            message( false );
            gifLoad( {} );
            resolve({ message: 'success', id: data.updateAtt.AttendanceId._id })
          }
        } catch({ graphQLErrors }) {
          console.log( graphQLErrors, 'dsfadfadfadsfs' )
          reject( graphQLErrors[0].message );
          setTimeout(() => {
            loading( false );
            message( false );
            gifLoad( {} );
          }, 10000)
        }
      } else if( error ){
        gifLoad({ uri: 'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif', first: 'woops something error', second: 'Please try again in 5 Second' })
        setTimeout(() => {
          loading( false );
          message( false );
          gifLoad( {} )
        }, 5000);
        reject( error );
      }
    } else {
      loading( false );
      gifLoad({ uri: 'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif', first: 'sorry cant take a picture', second: 'please try again' })
      setTimeout(() => {
        gifLoad( {} );
      }, 2000);
      reject({ msg: 'failed Upload picture' })
    }
  })
}

function _getCurrentLocation ({ os }) {
  return new Promise ( async (resolve, reject) => {
    let { status } = await Permissions.askAsync( Permissions.LOCATION );
    if( status !== 'granted' ) reject({ error: 'Please set allow your Location Device to next process' });
    else if( status === 'granted' ){
      if( os === 'android' ) {
        const { coords } = await Location.getCurrentPositionAsync({});
        console.log( coords, 'helpers' )
        if( coords.accuracy > 15 ) resolve({ coords });
        else reject({ error: 'Sorry, We suspect your location because it is less accurate' })
      }else {
        const { coords } = await Location.getCurrentPositionAsync({});
        console.log( 'ios', coords );
        if( coords.accuracy > 55 ) resolve({ coords } )
        else reject({ error: 'Sorry, We suspect your location because it is less accurate' })
      }
    } 
  })
}


export const _checkLocation = async ({ id, osPlatform, action, type, notif, nav, access, reason }) => {
  return new Promise ( async (resolve, reject) => {
    console.log( access, reason, '---------------------' )
    const { code, token } = access;
    console.log( code, token, 'dapat dari check location ')
    try {
      const { coords } = await _getCurrentLocation({ os: osPlatform });
      console.log( 'dapat coord', coords );
      if( coords ) {
        const { longitude, latitude, accuracy } = coords
        let os;
        if( osPlatform === 'android' ) os = 'android';
        else os = 'ios';
        console.log( os );
        if( longitude && latitude && accuracy && type && os ) {
          try {
            const { data } = await action.updateLocation({ variables: { code, token, os, type, reason, latitude: String(latitude), accuracy: String(accuracy), longitude: String(longitude), id }, refetchQueries: [ {query: action.query, variables: { code, token }} ] })
            console.log( 'success', data )
            if( data ) notif.msg( `${ type === 'checkin' ? 'Check In' : 'Check Out' } Successfully!`);
            resolve({ msg: 'success' })
            setTimeout(() => {
              notif.gif( {} );
              notif.msg( false );
              nav( 'Home' )
            }, 3000);
            if( data ) {
            } else notif.msg( 'Something Error please try again')
          }catch(err) { notif.msg( 'Something Error when Update the Location' ) }
        }
      }else notif.msg( 'We cant get your location..')
    }catch(err){
      console.log( 'error', err );
      reject( err )
      if( err.graphQLErrors ) {
        notif.gif( {} );
        notif.msg( err.graphQLErrors[0].message )
        const { data } = await action.upFailed({ code, token, id })
        console.log( 'success delete', data );
      } else {
        notif.gif( {} );
        console.log( 'masuk error' );
        notif.msg( err.error );
        const { data } = await action.upFailed({ code, token, id })
        console.log( 'success delete else ', data );
      }
    }
  })
}


export const getCurrentTime = ({ setTime, setDay, days }) => {
  let hour = new Date().getHours();
  let minutes = new Date().getMinutes();
  let seconds = new Date().getSeconds();
  let am_pm = 'pm';

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  if (hour > 12) {
    hour = hour - 12;
  }

  if (hour == 0) {
    hour = 12;
  }

  if (new Date().getHours() < 12) {
    am_pm = 'am';
  }

  setTime( hour + ':' + minutes + ':' + seconds + ' ' + am_pm );

  days.map((item, key) => {
    if (key == new Date().getDay()) {
      setDay( item.toUpperCase() );
    }
  })
}