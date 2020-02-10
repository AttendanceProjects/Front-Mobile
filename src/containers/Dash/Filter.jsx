import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome5';
import { LoadingFilterComponent, ErrorFilterComponent } from '../../components';
import { getAccess, getServerTime } from '../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ListHistoryFilterComponent } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';


export const FilterContainers = ({ navigation }) => {
  const [ selectName, setSelectName ] = useState( [] );
  const [ loading, setLoading ] = useState( false );
  const [ access, setAccess ] = useState( {} );
  const [ getFilter, { data: filtering } ] = useLazyQuery( Query.FILTER_ATT, { fetchPolicy: 'no-cache' } );
  const [ errorMessage, setErrorMessage ] = useState( false );
  const [ selectQuery, setSelect ] = useState( 'late' );
  const [ show, setShow ] = useState( false );
  const [ keyWord, setKeyWord ] = useState( '' );

  useEffect(() => {
    if( access && access.code && selectQuery !== 'date' ) {
      (async() => {
        if( selectQuery && selectQuery !== 'date' ) {
          setLoading( true )
          try{
            const { code, token } = access;
            await getFilter({ variables: { code, token, category: selectQuery } });
            setLoading( false );
          }catch({ graphQLErrors }) { setErrorMessage( graphQLErrors[0].message ) }
        }
      })()
    }else if( access && access.code && selectQuery === 'date' ) {
      (async() => {
        try {
          setKeyWord( new Date() );
          setLoading( true );
          const { code, token } = access;
          await getFilter({ variables: { code, token, category: selectQuery, search: new Date().toDateString() } })
          setLoading( false );
        }catch({ graphQLErrors }){ console.log(graphQLErrors[0].message ) }
      })()
    }else{
      (async() => {
        setSelectName([ {name: 'late', icon: 'running', status: true}, {name: 'checkout', icon: 'sign-out-alt', status: false}, {name: 'absent', icon: 'user-times', status: false}, {name: 'date', icon: 'sign-in-alt', status: false}, ])
        try{
          setLoading( true )
          const { code, token } = await getAccess();
          setAccess({ code, token })
          await getFilter({ variables: { code, token, category: 'late' } });
          setLoading( false );
        }catch({ graphQLErrors }) { setErrorMessage( graphQLErrors[0].message ) }
      })()
    }
  }, [ selectQuery, access ])

  const setDate = async (event, date) => {
    if( Platform.OS === 'android' ){
      setLoading( true );
      if( event.type === 'set' ){
        await searchDate( date );
        setShow( false );
      }else {
        await setKeyWord( new Date () );
        setShow( false );
      }
      setLoading( false );
    }else {
      await setKeyWord( date );
    }
  }

  const searchDate = async ( date ) => {
    try {
      setLoading( true );
      const { code, token } = access;
      await getFilter({ variables: { code, token, search: new Date( Platform.OS === 'android' ? date : keyWord ).toDateString(), category: selectQuery } });
      setShow( false );
      setLoading( false );
    }catch({ graphQLErrors }) { setErrorMessage( graphQLErrors[0].message ) }
  }

  const _onPageChange = async ( name ) => {
    setLoading( true );
    let newVal = [];
    await selectName.forEach((el, i) => {
      if( el.name === name ) {
        newVal.push({ ...el, status: true })
        setSelect( el.name );
      }else newVal.push({ ...el, status: false })
    })
    await setSelectName( newVal );
    setLoading( false );
  }

  const _onNavigationChange = _ => navigation.navigate('Detail', { id: item._id, access, date: item.date })

  return (
    <View style={{ backgroundColor: '#353941', flex: 1, padding: 10, justifyContent: 'space-between' }}>
      <View style={{ flex: 0.12, backgroundColor: '#26282b', borderRadius: 20, borderBottomEndRadius: 80, borderTopStartRadius: 80, borderTopEndRadius: 0, borderBottomStartRadius: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
        { selectName && selectName.map((el, i) => (
          <TouchableOpacity key={ i } style={{ flex: 0.24, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }} onPress={ () => _onPageChange( el.name ) }>
            <View style={{ height: 40, width: 40, borderRadius: 20, borderTopStartRadius: el.name === 'late' ? 80 : 20, borderBottomEndRadius: el.name === 'absent' ? 80 : 20, backgroundColor: el.status ? 'red' : '#26282b', alignItems: 'center', justifyContent: 'center' }}>
              <Font name={ el.icon } size={ 25 } color={ 'white' }/>
            </View>
            <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#ce0f3d' }}>{ el.name.toUpperCase() }</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 0.87, backgroundColor: '#26282b', borderRadius: 25, padding: 5 }}>
        { loading
            ? <LoadingFilterComponent text={{ first: "Please Wait...", second: "Fetching Data" }} color={ 'red' }/>
            : filtering && filtering.filter && filtering.filter.length > 0 && selectQuery !== 'date'
                ? 
                <SwipeListView
                  data={ filtering.filter }
                  disableRightSwipe={true}
                  closeOnRowOpen={true}
                  stopLeftSwipe={35}
                  closeOnRowBeginSwipe={true}
                  closeOnScroll={true}
                  closeOnRowPress={true}
                  renderItem={ ({item}) => (
                    <ListHistoryFilterComponent
                      key={ item._id }
                      load={ loading }
                      bc= { '#c9485b' }
                      justy={ 'space-between' }
                      size={{
                        role: Platform.OS === 'android' ? 10 : 13,
                        time: Platform.OS === 'android' ? 18 : 24,
                        name: Platform.OS === 'android' ? 10 : 16,
                        date: Platform.OS === 'android' ? 15 : 20
                      }}
                      typeParent={{ date: item.date, image: { start: item.start_image, end: item.end_image }, type: 'date', username: item.UserId.username, role: item.UserId.role, startTime: item.start, startIssues: item.start_issues, endTime: item.end, endIssues: item.end_issues, reason: { start: item.start_reason, end: item.end_reason }, empty: filtering.filter.length > 0 ? false : true }}
                    />
                  )}
                  keyExtractor={( item, index ) => index.toString()}
                  renderHiddenItem={({ item }) => (
                    <TouchableOpacity
                      style={{ width: 50, right: 15, top: 25, position: 'absolute', flexDirection: 'row-reverse', marginTop: 20, marginLeft: 20, height: 50, alignItems: 'center' }}
                      onPress={() => _onNavigationChange()}
                      >
                        <Font name={ 'pen-alt' } size={ 30 } color={ 'white' } />
                    </TouchableOpacity>
                  )}
                  leftOpenValue={75}
                  rightOpenValue={-75}
                  />
                // : filtering && filtering.filter && selectQuery === 'date'
                : selectQuery === 'date'
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
                                  <DateTimePicker value={ keyWord } mode={ 'date' } display="default" onTouchCancel={test => console.log( 'trigger cancel', test )} onChange={ setDate }/>
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
                        { loading && filtering && !filtering.filter
                            ? <LoadingFilterComponent text={{ first: "Please Wait...", second: "Fetching Data" }} color={ 'red' }/>
                            : filtering && filtering.filter && filtering.filter.length > 0 && selectQuery === 'date'
                              ?
                                <SwipeListView
                                  data={ filtering.filter }
                                  disableRightSwipe={true}
                                  closeOnRowOpen={true}
                                  stopLeftSwipe={35}
                                  closeOnRowBeginSwipe={true}
                                  closeOnScroll={true}
                                  closeOnRowPress={true}
                                  renderItem={ ({item}) => (
                                    <ListHistoryFilterComponent
                                      key={ item._id }
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
                                        date: item.date,
                                        image: {
                                          start: item.start_image,
                                          end: item.end_image
                                        },
                                        type: 'date',
                                        username: item.UserId.username,
                                        role: item.UserId.role,
                                        startTime: item.start,
                                        startIssues: item.start_issues,
                                        endTime: item.end,
                                        endIssues: item.end_issues,
                                        reason: {
                                          start: item.start_reason,
                                          end: item.end_reason
                                        },
                                        empty: filtering.filter.length > 0 ? false : true,
                                      }}
                                    />
                                  )}
                                  keyExtractor={( item, index ) => index.toString()}
                                  renderHiddenItem={({ item }) => (
                                    <TouchableOpacity
                                      style={{ width: 50, right: 15, top: 25, position: 'absolute', flexDirection: 'row-reverse', marginTop: 20, marginLeft: 20, height: 50, alignItems: 'center' }}
                                      onPress={() => _onNavigationChange()}
                                      >
                                        <Font name={ 'pen-alt' } size={ 30 } color={ 'white' } />
                                    </TouchableOpacity>
                                  )}
                                  leftOpenValue={75}
                                  rightOpenValue={-75}
                                />
                                  : <ErrorFilterComponent text={ 'Empty Data' } size={ 30 } /> }
                      </>
                    : <ErrorFilterComponent text={ 'Empty Data' } size={ 30 }/>}
      </View>
    </View>
  )
}