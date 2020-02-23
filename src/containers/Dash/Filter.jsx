import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, ActivityIndicator, Image } from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome5';
import { ErrorFilterComponent } from '../../components';
import { getAccess } from '../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';
import { ListHistoryFilterComponent } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';


export const FilterContainers = ({ navigation }) => {
  const [ selectName, setSelectName ] = useState( [] );
  const [ access, setAccess ] = useState( {} );
  const [ getFilter, { data: filtering, loading } ] = useLazyQuery( Query.FILTER_ATT, { fetchPolicy: 'no-cache' } );
  const [ errorMessage, setErrorMessage ] = useState( false );
  const [ selectQuery, setSelect ] = useState( 'late' );
  const [ show, setShow ] = useState( false );
  const [ keyWord, setKeyWord ] = useState( '' );

  useEffect(() => {
    if( access && access.code && selectQuery !== 'date' ) {
      (async() => {
        if( selectQuery && selectQuery !== 'date' ) {
          try{
            const { code, token } = access;
            await getFilter({ variables: { code, token, category: selectQuery } });
          }catch({ graphQLErrors }) { setErrorMessage( graphQLErrors[0].message ); _onClear( setErrorMessage ); }
        }
      })()
    }else if( access && access.code && selectQuery === 'date' ) {
      ( true );
      (async() => {
        try {
          setKeyWord( new Date() );
          const { code, token } = access;
          await getFilter({ variables: { code, token, category: selectQuery, search: new Date().toDateString() } })
        }catch({ graphQLErrors }){ setErrorMessage( graphQLErrors[0].message ); _onClear( setErrorMessage );; }
      })()
    }else{
      (async() => {
        setSelectName([ {name: 'late', icon: 'running', status: true}, {name: 'checkout', icon: 'sign-out-alt', status: false}, {name: 'absent', icon: 'user-times', status: false}, {name: 'date', icon: 'sign-in-alt', status: false}, ])
        try{
          const { code, token } = await getAccess();
          setAccess({ code, token })
          await getFilter({ variables: { code, token, category: 'late' } });
        }catch({ graphQLErrors }) { setErrorMessage( graphQLErrors[0].message ); _onClear( setErrorMessage );; }
      })()
    }
  }, [ selectQuery, access ])

  const _onClear = meth => setTimeout(() => meth( false ), 2000)

  const setDate = async (event, date) => {
    if( Platform.OS === 'android' ){
      if( event.type === 'set' ){
        await searchDate( date );
        setShow( false );
      }else {
        await setKeyWord( new Date () );
        setShow( false );
      }
    }else {
      await setKeyWord( date );
    }
  }

  const searchDate = async ( date ) => {
    try {
      const { code, token } = access;
      await getFilter({ variables: { code, token, search: new Date( Platform.OS === 'android' ? date : keyWord ).toDateString(), category: selectQuery } });
      setShow( false );
    }catch({ graphQLErrors }) { setErrorMessage( graphQLErrors[0].message ); _onClear( setErrorMessage );; }
  }

  const _onPageChange = async ( name ) => {
    let newVal = [];
    await selectName.forEach((el, i) => {
      if( el.name === name ) {
        newVal.push({ ...el, status: true })
        setSelect( el.name );
      }else newVal.push({ ...el, status: false })
    })
    await setSelectName( newVal );
  }

  const _onNavigationChange = el => navigation.navigate('Detail', { id: el._id, access, date: el.date })

  return (
    <View style={{ backgroundColor: '#353941', flex: 1, padding: 10, justifyContent: 'space-between' }}>
      <View style={{ flex: 0.12, backgroundColor: '#26282b', borderRadius: 20, borderBottomEndRadius: 80, borderTopStartRadius: 80, borderTopEndRadius: 0, borderBottomStartRadius: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
        { selectName && selectName.map((el, i) => (
          <TouchableOpacity key={ i } style={{ flex: 0.24, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }} onPress={ () => _onPageChange( el.name ) }>
            <View style={{ height: 40, width: 40, borderRadius: 20, borderTopStartRadius: el.name === 'late' ? 80 : 20, borderBottomEndRadius: el.name === 'date' ? 80 : 20, backgroundColor: el.status ? 'red' : '#26282b', alignItems: 'center', justifyContent: 'center' }}>
              <Font name={ el.icon } size={ 25 } color={ 'white' }/>
            </View>
            <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#ce0f3d' }}>{ el.name.toUpperCase() }</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 0.87, backgroundColor: '#26282b', borderRadius: 25, padding: 5 }}>
        { loading && !errorMessage
            ? <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color='white' size='large' />
                <Text style={{ marginTop: 10, fontWeight: 'bold', color: 'white', fontSize: 19, letterSpacing: 1 }}>Loading...</Text>
              </View>
            : null }
        { errorMessage && !loading
            ? <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={ require('../../../assets/sadforerror.png') } style={{ width: 150, height: 150 }} />
                <Text style={{ fontWeight: 'bold', fontSize: 19, letterSpacing: 1, color: 'red' }}>{ errorMessage }</Text>
              </View>
            : null }
        { filtering && filtering.filter && filtering.filter.length > 0 && selectQuery !== 'date' && !loading && !errorMessage
                ? filtering.filter.map(el => (
                    <View key={ el._id } style={{ position: 'relative' }}>
                      <ListHistoryFilterComponent
                        load={ loading }
                        bc= { '#c9485b' }
                        justy={ 'space-between' }
                        size={{
                          role: Platform.OS === 'android' ? 10 : 13,
                          time: Platform.OS === 'android' ? 18 : 24,
                          name: Platform.OS === 'android' ? 10 : 16,
                          date: Platform.OS === 'android' ? 15 : 20
                        }}
                        typeParent={{ date: el.date, image: { start: el.start_image, end: el.end_image }, type: 'date', username: el.UserId.username, role: el.UserId.role, startTime: el.start, startIssues: el.start_issues, endTime: el.end, endIssues: el.end_issues, reason: { start: el.start_reason, end: el.end_reason }, empty: filtering.filter.length > 0 ? false : true }}
                      />
                      <TouchableOpacity onPress={() => _onNavigationChange( el )} style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, top: 2, backgroundColor: 'white', borderRadius: 20 }}>
                        <Font name='info' size={ 20 } />
                      </TouchableOpacity>
                    </View>
                ))
                : selectQuery === 'date' && !loading && !errorMessage
                    ?
                      <>
                        <View>
                          <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setShow( !show )} style={{ marginRight: 10, marginTop: -20 }}>
                              <Font name={ 'calendar-alt' } size={ 30 } color={ 'white' }/>
                            </TouchableOpacity>
                          </View>
                          <View style={{ backgroundColor: '#f1f1f6', borderRadius: 80 }}>
                            { show
                                &&
                                <>
                                  <DateTimePicker value={ keyWord } mode={ 'date' } display="default" onChange={ setDate }/>
                                  { Platform.OS === 'ios' 
                                      && <View style={{ width: '100%', justifyItems: 'center', alignItems: 'center' }}>
                                      <TouchableOpacity onPress={() => searchDate()} style={{ width: '25%', borderRadius: 20, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', height: 30 }}>
                                        <Text style={{ color: '#353941', fontWeight: 'bold', letterSpacing: 2 }}>Search</Text>
                                      </TouchableOpacity>
                                    </View> }
                                </>
                            }
                          </View>
                        </View> 
                        { filtering && filtering.filter && filtering.filter.length > 0 && selectQuery === 'date' && !loading && !errorMessage
                              ? filtering.filter.map(el => (
                                  <View style={{ position: 'relative' }} key={ el._id }>
                                    <ListHistoryFilterComponent
                                      load={ loading }
                                      bc= { '#c9485b' }
                                      justy={ 'space-between' }
                                      size={{
                                        role: Platform.OS === 'android' ? 10 : 13,
                                        time: Platform.OS === 'android' ? 18 : 24,
                                        name: Platform.OS === 'android' ? 10 : 16,
                                        date: Platform.OS === 'android' ? 15 : 20
                                      }}
                                      typeParent={{
                                        date: el.date,
                                        image: {
                                          start: el.start_image,
                                          end: el.end_image
                                        },
                                        type: 'date',
                                        username: el.UserId.username,
                                        role: el.UserId.role,
                                        startTime: el.start,
                                        startIssues: el.start_issues,
                                        endTime: el.end,
                                        endIssues: el.end_issues,
                                        reason: {
                                          start: el.start_reason,
                                          end: el.end_reason
                                        },
                                        empty: filtering.filter.length > 0 ? false : true,
                                      }}
                                    />
                                    <TouchableOpacity onPress={() => _onNavigationChange( el )} style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, top: 2, backgroundColor: 'white', borderRadius: 20 }}>
                                      <Font name='info' size={ 20 } />
                                    </TouchableOpacity>
                                </View>
                              ))
                              : !loading && !errorMessage ? <ErrorFilterComponent text={ 'Empty Data' } size={ 30 } /> : null }
                      </>
                    : !loading && !errorMessage ? <ErrorFilterComponent text={ 'Empty Data' } size={ 30 }/> : null }
      </View>
    </View>
  )
}