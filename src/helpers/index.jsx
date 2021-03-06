import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

// -6.132331, 106.808560
export const takeAPicture = ({ camera, type, action, loading, message, gifLoad, upload, access, start_reason }) => {
  return new Promise ( async (resolve, reject ) => {
    const { uri } = await camera.takePictureAsync({ quality: 0.5 });
    const { code, token } = access;
    if( uri ) {
      loading( true );
      gifLoad({ uri: 'https://media.giphy.com/media/VseXvvxwowwCc/giphy.gif', first: 'Please Wait...', second: type.msg === 'checkout' ? 'Process Check Out' : 'Process Check In' })
      const formData = new FormData();
      formData.append( 'image', { name: `images/${ type.msg }.jpg`, type: 'image/jpg', uri })
      const { success, error } = await upload({ code, token, formData });
      if( success ) {
        try {
          if( type.msg === 'checkin' ) {
            const { data } = await action.mutation({ variables: { code, token, start_image: success, start_reason }, refetchQueries: [ {query: action.history, variables: { code, token }}, {query: action.query, variables: {code, token}}, {query: action.daily, variables: {code, token}} ] });
            message( false );
            gifLoad( {} );
            resolve({ message: 'success', id: data.createAtt._id })
          }
          else if ( type.msg === 'checkout' ) {
            //{query: type.query, variables: {code, token}},
            const { data } = await action.mutation({ variables: { code, token, end_image: success, id: type.id, end: 'false' }, refetchQueries: [ {query: type.daily, variables: {code, token}} ] });
            message( false );
            gifLoad( {} );
            resolve({ message: 'success', id: data.updateAtt._id })
          }
        } catch({ graphQLErrors }) {
          reject( graphQLErrors[0].message );
          setTimeout(() => {
            loading( false );
            message( false );
            gifLoad( {} );
          }, 10000)
        }
      } else if( error ){
        gifLoad({ uri: 'https://media.giphy.com/media/VseXvvxwowwCc/giphy.gif', first: 'woops something error', second: 'Please try again in 5 Second' })
        setTimeout(() => {
          loading( false );
          message( false );
          gifLoad( {} )
        }, 5000);
        reject( error );
      }
    } else {
      loading( false );
      gifLoad({ uri: 'https://media.giphy.com/media/VseXvvxwowwCc/giphy.gif', first: 'sorry cant take a picture', second: 'please try again' })
      setTimeout(() => {
        gifLoad( {} );
      }, 2000);
      reject({ msg: 'failed Upload picture' })
    }
  })
}

function _getCurrentLocation ({ os }) {
  return new Promise (async (resolve, reject) => {
    let { status } = await Permissions.askAsync( Permissions.LOCATION );
    if( status !== 'granted' ) reject({ error: 'Please set allow your Location Device to next process' });
    else if( status === 'granted' ){
      if( os === 'android' ) {
        const { coords } = await Location.getCurrentPositionAsync({});
        if( coords.accuracy > 15 ) resolve({ coords });
        else reject({ error: 'Sorry, We suspect your location because it is less accurate' })
      }else {
        const { coords } = await Location.getCurrentPositionAsync({});
        if( coords.accuracy > 55 ) resolve({ coords } )
        else reject({ error: 'Sorry, We suspect your location because it is less accurate' })
      }
    } 
  })
}

export const CheckLocation = _getCurrentLocation;


export const _getLocationBeforeAbsent = () => {
  return new Promise (async resolve => {
    let { status } = await Permissions.askAsync( Permissions.LOCATION );
    if( status !== 'granted' ) resolve({ error: 'Please set allow your location device to next process' });
    else {
      const { coords: { longitude, latitude } } = await Location.getCurrentPositionAsync({});
      resolve({ longitude, latitude });
    }
  })
}

export const _getCurrentLocationOffline = () => {
  return new Promise ( async (resolve, reject) => {
    let { status } = await Permissions.askAsync( Permissions.LOCATION );
    if( status !== 'granted' ) reject({ error: 'Please set allow your location device to next process' });
    else if( status === 'granted' ) {
      const { coords } = await Location.getCurrentPositionAsync({});
      resolve({ coords })
    }
  })
}

export const _checkLocation = async ({ id, osPlatform, action, type, notif, nav, access, reason }) => {
  return new Promise ( async (resolve, reject) => {
    const { code, token } = access;
    try {
      const { coords } = await _getCurrentLocation({ os: osPlatform });
      if( coords ) {
        const { longitude, latitude, accuracy } = coords
        let os;
        if( osPlatform === 'android' ) os = 'android';
        else os = 'ios';
        if( longitude && latitude && accuracy && type && os ) {
          try {
            //{query: action.query, variables: { code, token }}, 
            // , refetchQueries: [ {query: action.query, variables: { code, token }}, {query: action.daily, variables: {code, token}}, {query: action.history, variables: {code, token}} ]
            const { data } = await action.updateLocation({ variables: { code, token, os, type, reason, latitude: String(latitude), accuracy: String(accuracy), longitude: String(longitude), id }, refetchQueries: [{query: action.daily, variables: {code, token}} ] })
            if( data ) {
              notif.msg( `${ type } Successfully!`);
              resolve({ msg: 'success' })
              setTimeout(() => {
                notif.gif( {} );
                notif.msg( false );
                nav( 'LiveAtt' )
              }, 3000);
            } else notif.msg( 'Something Error please try again')
          }catch({ graphQLErrors }) { notif.msg( graphQLErrors[0].message ) }
        }
      }else notif.msg( 'We cant get your location..')
    }catch(err){
      reject( err )
      if( err.graphQLErrors ) {
        notif.gif( {} );
        notif.msg( err.graphQLErrors[0].message )
        await action.upFailed({ code, token, id })
      } else {
        notif.gif( {} );
        notif.msg( err.error );
        await action.upFailed({ code, token, id })
      }
    }
  })
}


export const getCurrentTime = ({ setTime }) => {
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

}