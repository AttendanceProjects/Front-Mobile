import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

// -6.132331, 106.808560
export const takeAPicture = ({ camera, type, action, loading, message, gifLoad, upload, access }) => {
  return new Promise ( async (resolve, reject ) => {
    const { uri } = await camera.takePictureAsync();
    const { code, token } = await access();
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
            const { data } = await action.mutation({ variables: { code, token, end_image: success, id: type.id } });
            loading( false );
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
        gifLoad({ uri: 'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif', first: 'woops something error', second: 'Please try again in 5 Second' })
        setTimeout(() => {
          loading( false );
          message( false );
          gifLoad( {} )
        }, 5000)
      }
    } else {
      loading( false );
      gifLoad({ uri: 'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif', first: 'sorry cant take a picture', second: 'please try again' })
      setTimeout(() => {
        gifLoad( {} );
      }, 2000);
    }
  })
}

export const _getCurrentLocation = ({ os }) => {
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