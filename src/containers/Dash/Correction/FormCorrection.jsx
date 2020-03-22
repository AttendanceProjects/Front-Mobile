import React, { useState, useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Font from 'react-native-vector-icons/FontAwesome5';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Query, Mutation } from '../../../graph'
import { getAccess, uploadImage, getServerTime } from '../../../service';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export const FormCorrectionContainers = ({ navigation }) => {
  const [ show, setShow ] = useState( false );
  const [ serverTime, setServerTime ] = useState( '' );
  const [ loading, setLoading ] = useState( false );
  const [ keyword, setKeyWord ] = useState( new Date() );
  const [ startDate, setStartDate ] = useState( '' ); // for android
  const [ endDate, setEndDate ] = useState( '' ); // for android
  const [ reason, setReason ] = useState( '' );
  const [ images, setImages ] = useState( false );
  const [ success, setSuccess ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ access, setAccess ] = useState( {} );
  const [ defaultTime, setDefault ] = useState( '' );
  const [ fetchAtt, { data: Att } ] = useLazyQuery( Query.GET_ATT_ID );
  const [ created ] = useMutation( Mutation.CREATE_CORRECTION );


  useEffect(() => {
    (async () => {
      setLoading( true );
      setDefault( new Date().toISOString("en-US", {timeZone: "Asia/Jakarta"}) )
      await _getPermissionAsync();
      const { id } = navigation.state.params;
      const { code, token } = await getAccess();
      const { time, error } = await getServerTime({ code, token });
      if( error ) {
        setMessage( error );
        setTimeout(() => setMessage( false ), 2000);
      }
      setServerTime( time )
      if ( id, code, token ) {
        await setAccess({ code, token, id })
        await fetchAtt({ variables: { code, token, id } });
        setLoading( false );
      }
    })()
  }, [])

  const _clearForm = () => {
    setStartDate( '' );
    setEndDate( '' );
    setReason( false );
    setImages( false );
  }

  const _onCreateCorrection = async _ => {
    try { 
      setLoading( true );
      const { token, code, id } = access;
      if( images ) {
        let formData = new FormData();
        formData.append( 'image', { name: `correction-${ new Date().toLocaleString() }.jpg`, type: 'image/jpg', uri: images })
        var { success, error } =  await uploadImage({ code, token, formData })
        if( startDate, endDate, reason ) {
          const start_time = new Date( startDate ).toLocaleString("en-US", {timeZone: "Asia/Jakarta"})
          const end_time = new Date( endDate ).toLocaleString("en-US", {timeZone: "Asia/Jakarta"})
          if( success ) {
            const { data } = await created({ variables: { code, token, id, start_time, end_time, image: success? success : '', reason }, refetchQueries: [{ query: Query.USER_CORRECTION, variables: { code, token } }]})
            if( data && data.createCorrection ) {
              setSuccess( data.createCorrection.msg )
              setLoading( false )
              setTimeout(() => {
                navigation.navigate( 'All' );
                _clearForm();
                setSuccess( false );
              }, 5000)
            }
          }else {
            setMessage( error );
            setLoading( false );
            setTimeout(() => setMessage( false ), 5000);
          }
        }else {
          setLoading( false );
          setMessage( 'please complete all requirment' );
          setTimeout(() => setMessage( false ), 5000);
        }
      }else {
        setMessage( 'image is required' );
        setLoading( false );
        setTimeout(() => { setMessage( false ) }, 3000);
      }
    }catch({ graphQLErrors }) {
      if( graphQLErrors[0].message === 'Validation Error' ) setMessage( 'something required!' );
      else setMessage( graphQLErrors[0].message );
      setLoading( false );
      setTimeout(() => setMessage( false ), 4000)
    }
  }

  const _getPermissionAsync = async () => {
    if ( Platform.OS === 'ios' || Platform.OS === 'IOS' ) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        setLoading( false );
      }
    }
  }

  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      setImages( result.uri );
    }
  };

  // for IOS only
  const searchDate = name => {
    if( name === 'start' ) {
      setStartDate( keyword );
      setShow( false );
    }else if( name === 'end' ) {
      setEndDate( keyword );
      setShow ( false );
    }
  }

  // for Android
  const setDate = async (event, time) => {
    if( Platform.OS === 'android' ){
      setShow( false )
      setLoading( true );
      if( event.type === 'set' ){
        if ( show === 'start' ) setStartDate( time );
        else setEndDate( time );
        setShow( false );
      }else {
        await setKeyWord( new Date () );
        setShow( false );
      }
      setLoading( false );
    }else await setKeyWord( time );
  }

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Text style={{ fontWeight: 'bold', marginTop: 10, color: 'black', fontSize: 30, textAlign: 'center' }}>Form Correction</Text>

      <View style={{ padding: 8, marginTop: 10 }}>
        <View style={{ padding: 10, borderWidth: 1, borderColor: 'black', height:  '65%', borderRadius: 10 }}>
          { loading
              &&  <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={ 'blue' } />
                  </View> }
          { Att && Att.findAttId && !loading
              ?
              <>
                <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, height: 65, justifyContent: 'space-around' }}>
                  <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text>Before</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 15 : 20 }}>{ Att.findAttId && Att.findAttId.date ? Att.findAttId.date : 'No Date' }</Text>
                  </View>
                  <View style={{ marginTop: 5, flexDirection: 'row', width: '100%' }}>
                    <Text style={{ width: '50%'}}><Text style={{ fontSize: 13 }}>Check In:</Text> &nbsp; <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 15 : 18  }}>{ Att.findAttId && Att.findAttId.start ? Att.findAttId.start : '00:00:00 AM' }</Text></Text>
                    <Text style={{ width: '50%' }}><Text style={{ fontSize: 13 }}>Check Out:</Text> &nbsp; <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 15 : 18  }}>{ Att.findAttId && Att.findAttId.end ? Att.findAttId.end : '00:00:00 AM' }</Text></Text>
                  </View>
                </View>
                <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, marginTop: 20, justifyContent: 'space-around', height: 50 }}>
                  <Text>After</Text>
                  
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
                    
                    <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'space-around' }}>
                      <View style={{ height: '100%', padding: 5, width: '50%'  }}>
                        <Text>{ startDate ? startDate.toLocaleTimeString() : keyword ? keyword.toISOString().slice(0, 19).split('T')[1] : '-' }</Text>
                      </View>
                      <TouchableOpacity onPress={() => setShow( 'start' )}>
                        <Font name={ 'pen-alt' } size={ 20 } color={ 'black' }/>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'space-around' }}>
                      <View style={{ height: '100%', padding: 5 , width: '50%' }}>
                        <Text>{ endDate ? endDate .toLocaleTimeString(): keyword ? keyword.toISOString().slice(0, 19).split('T')[1] : '-' }</Text>
                      </View>
                      <TouchableOpacity onPress={() => setShow( 'end' )}>
                        <Font name={ 'pen-alt' } size={ 20 } color={ 'black' } />
                      </TouchableOpacity>
                    </View>
                  </View> 
                </View>

                <View style={{ height: 50, flexDirection: 'row' }}>
                  <View style={{ width: '50%', padding: 5 }}>
                    <Text> Reason </Text>
                    <TextInput keyboardType='default' autoCapitalize='none' value={ reason } onChangeText={ msg => setReason ( msg ) } style={{ borderWidth: 1, borderColor: 'black', padding: Platform.OS === 'android' ? 2 : 1, height: 25, width: '100%', fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 10 : 15, marginTop: 10 }} placeholder={ 'Input your Reason Here' } placeholderTextColor={ 'black' }/>
                  </View>

                  <View style={{ width: '50%', flexDirection: 'row', justifyContent: "flex-end"}}>
                  {images ?
                    <View style={{ height: 100, width: 100, marginRight: 10, marginTop: 10 }}>
                      <Image source={{ uri: images }} style={{ width: '100%', height: '100%' }} />
                    </View> : null }
                  { !images 
                      ? <TouchableOpacity
                          onPress={ _pickImage }
                          style={{ backgroundColor: '#a9fffd', height: 30, width: 150, borderRadius: 20, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}
                        ><Text style={{ color: 'black', fontWeight: 'bold', letterSpacing: 1 }}>Choose Image</Text></TouchableOpacity>
                      : <TouchableOpacity onPress={() => setImages( '' )} style={{ marginTop: 10, backgroundColor: '#f64b3c', height: 30, width: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}><Text>Cancel</Text></TouchableOpacity>}
                  </View>
                </View>
              </>
          : null }
        </View>
        { Att && Att.findAttId && !loading
            ? 
              <View style={{ width: '100%', alignItems: 'center', marginTop: 15 }}>
                { message && <Text style={{ fontStyle: 'italic', color: 'red', fontSize: 18 }}>{ message }</Text> }
                { success && <Text style={{ fontStyle: 'italic', color: 'green', fontSize: 18 }}>{ success }</Text>}
                <TouchableOpacity style={{ backgroundColor: '#5f85db', width: 100, height: 25, borderRadius: 10,  marginTop: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => _onCreateCorrection()}>
                  <Text style={{ fontWeight: 'bold', color: 'white', fontSize: Platform.OS === 'android' ? 10 : 15 }}>Send Request</Text>
                </TouchableOpacity>
              </View>
            : null }
        
        <View style={{ backgroundColor: '#f1f1f6', borderRadius: 80 , position: 'absolute', bottom: 0, width: '100%', marginLeft: 10 }}>
            { show && show === 'start'
                &&  <DateComponent setDate={ setDate } keyword={ keyword } os={ Platform.OS } searchDate={ searchDate } type={ 'start' }/>
            }
            { show && show === 'end'
                &&  <DateComponent setDate={ setDate } keyword={ keyword } os={ Platform.OS } searchDate={ searchDate } type={ 'end' }/>
            }
          </View>
      </View>
    </View>
  )
}

const DateComponent = ({ keyword, searchDate, os, type, setDate }) => {
  return (
    <>
      <DateTimePicker value={ keyword }
            mode={ 'time' }
            display="default"
            onChange={ setDate }/>
      { os === 'ios' 
          &&  <View style={{ width: '100%', justifyItems: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => searchDate( type )} style={{ width: '25%', borderRadius: 20, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', height: 30 }}>
                  <Text style={{ color: '#353941', fontWeight: 'bold', letterSpacing: 2 }}>Search</Text>
                </TouchableOpacity>
              </View> }
    </>
  )
}