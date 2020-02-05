import React, { useState, useEffect } from 'react';
import { OfflieHeaderComponent, PermissionComponent } from '../../components'
import { View, Text, Image, TouchableOpacity, AsyncStorage, ScrollView, Platform } from 'react-native';
import { getAccess, checkConnection } from '../../service';
import { Query } from '../../graph';
import { _getCurrentLocation } from '../../helpers'
import Font from 'react-native-vector-icons/FontAwesome5';
import { useLazyQuery } from '@apollo/react-hooks';

export const Dash = ({ navigation }) => {
  const [ getUser, { data: CheckUser } ] = useLazyQuery( Query.CHECK_SIGN_IN );
  const [ getCompany, { data: Company } ] = useLazyQuery( Query.GET_COMPANY );
  const [ usage ] = useState([ {name: 'History', icon: 'calendar-alt'}, {name: 'Attendance', icon: 'map-marker-alt'}, {name: 'Correction', icon: 'crop-alt'} ])
  const [ isOnline, setIsOnline ] = useState( false );
  const [ error, setError ] = useState( false );

  useEffect(() => {
    (async () => {
      try {
        const { code, token } = await getAccess();
        await checkConnection({ save: setIsOnline });
        await getUser({ variables: { code, token } });
        await getCompany({ variables: { code, token } });
      }catch({ graphQLErrors }) { setError( graphQLErrors[0].message ) }
    })()
  }, [])

  useEffect(() => {
    (async() => {
      const offline = await AsyncStorage.getItem('offline');
      if( offline ) {
        const { location, url, time } = await JSON.parse( offline );
        console.log( 'masik simpan di local loation dan url pidturenya', location, url, time );
        console.log( 'masuk sini ?' )
      }
    })()
  }, [ isOnline ])


  const onPageChange = name => {
    if( name === 'History' ) navigation.navigate( 'History' );
    else if( name === 'Attendance' ) navigation.navigate( 'LiveAtt' );
    else if( name === 'Correction' ) navigation.navigate( 'Correction' );
  }

  return (
    <View style={{ backgroundColor: '#5b5656', flex: 1 }}>
      { !isOnline && <OfflieHeaderComponent /> }
      <View style={{ flex: 0.55, backgroundColor: '#90b8f8' }}>
        <View style={{ height: Platform.OS === 'android' ? 80 : 60, borderBottomWidth: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ marginBottom: 10, fontSize: Platform.OS === 'android' ? 20 : 25, letterSpacing: 2, fontWeight: 'bold', fontStyle: 'italic', color: '#353941' }}>Presence</Text>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: Platform.OS === 'android' ? 12 : 15, color: 'black', fontWeight: 'bold', letterSpacing: 1 }}> { Company && Company.getCompany ? Company.getCompany.company_name : null }</Text>
        </View>
        <View style={{ padding: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
          { CheckUser && CheckUser.checkSignin  
              ? 
                <>
                  <View style={{ marginLeft: 10, flex: 0.85 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 30 : 35, letterSpacing: 2 }}>
                      { CheckUser.checkSignin.username.toUpperCase() }
                    </Text>
                    <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 15 }}>{ CheckUser.checkSignin.role.toUpperCase() }</Text>
                  </View>
                  <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                    <Image source={{ uri: CheckUser.checkSignin.profile_image ? CheckUser.checkSignin.profile_image : 'https://00e9e64bac541899788207e07cb3694b79ab80a50e8774a65c-apidata.googleusercontent.com/download/storage/v1/b/ptlda/o/Default%2Fanimation.jpeg?qk=AD5uMEve3RD0GwmQnpFrg3oRbi4iV66yov7Z09iJhSAgIFtCyA5YQPDVtqMbaZ2V0HomeToNNESh_5N4hEb6sfbC-fXtMX8LObVDc9t1RaPgfeIFCTAXpw1RkxhV_ICh9zh_B0r_X2-rAPjvbyMBa901AsNYtz8NNaMU3PP7_WXjVnSnpAlKLzMtTG6uYHY2RSXJGdHdNtaMDkcmcunEkHbNGfKmOnLTWsXdY3eKl03t4q1LymJCJCdGImNRkrtVHf6jYn0ccvSVS0y7icGW_LlKWvslHs8sAMS6-Rk9EsYadbourmp2COx1cHsj6Sho9dDNYamXPBPg3fqiWVbhDrTGYVu4n84-ixuUW32UwA19-vWokPFTV1NPA5SqDI0GxZgRy20mfo2abv4KJsov-WGWPeF6ib4o2Hg70YndO1tjeqOxya0-1KBl4QetNjxWqvimgJ_hIPbW0YngzQo7Q0TCY6VtGMGvleUhI2pj4wjRwrKi7xtedpfWbivmT4i4MibBBG5fKCsBuxVn0xVd93Lx3vBPXErpTz6Kkzqpt7ixBKSjLFOaGwH_gBTcsAf4ypgKe7rvxIukFSV1Zb00ZhYPNeofJuqcm4LijObRRB9yKDMK_vSNpnHmKvDnpNNy4t-Scnxnx_bYO-cgsWcq6dQiskC3ByTEuzOP7q7a87ax9hIx7iEsnArDrUIXg8ihkqB2ZGJPn-Yqn_RwMewrl36Qu1UrdEcBOe_uDTQVUGQoTXC1yaXZTvHIEnhsvRQSMza0kkUnmALWk7KXZBq6k6tkraORr7sFr9w8T99IMFD5HLvVFMGjQUE' }} style={{ width: 60, height: 60, borderRadius: 90, marginRight: 10 }} />
                  </View>
                </> : null }
        </View>
        <View style={{ flex: 0.75, padding: 8 }}>
          <View style={{ flex: 1, backgroundColor: '#26282b', borderRadius: 35, padding: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
            { usage
                &&  usage.map((el, i) => (
                      <TouchableOpacity key={ i } style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => onPageChange( el.name ) }>
                        <Font name={ el.icon } size={ 30 } color={ 'white' }/>
                        <Text style={{ color: 'white' }}>{ el.name }</Text>
                      </TouchableOpacity>
                )) }
          </View>
        </View>
        <View style={{ flex: 0.35, padding: 8, flexDirection: 'row', alignItems: 'center' }}>
          <ScrollView horizontal={ true }>
            <PermissionComponent type={{ name: 'Cuti', icon: 'calendar-alt' }} />
            <PermissionComponent type={{ name: 'Permission', icon: 'sticky-note'}} />
          </ScrollView>
        </View>
      </View>
      <View style={{ flex: 0.45 }}>
        <View style={{ padding: 20, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: Platform.OS === 'android' ? 15 : 20, color: 'white', fontWeight: 'bold', letterSpacing: 2 }}>Announcement</Text>
            <Text style={{ fontSize: Platform.OS === 'android' ? 15 : 20, color: 'blue', fontWeight: "bold", letterSpacing: 2 }}>See All</Text>
          </View>
        </View>
      </View>
    </View>
  )
}