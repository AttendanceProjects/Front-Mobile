import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { getAccess } from '../../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../../graph';

const styles = StyleSheet.create({
  containers: {
    flex:1,
    backgroundColor: '#c2c2c2',
    padding: 20
  },
  content_header: {
    height: '20%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-around'
  },
  on_option: {
    height: 70,
    width: 70,
    borderRadius: 20,
    shadowOpacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c1c1'
  },
  body_content: {
    width: '100%',
    height: '80%',
    backgroundColor: '#fcf8e8',
    borderRadius: 20,
    padding: 6
  },
  item_content: {
    height: 150,
    width: '100%',
    borderRadius: 10,
    marginTop: 5,
    shadowOpacity: 0.5
  },
  item_header: {
    height: '22%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    padding: 5
  },
  item_text: {
    width: '50%',
    alignItems: 'center',
  },
  text_head: {
    color: 'grey',
    fontSize: 10
  },
  text_date: {
    letterSpacing: 1
  },
  body_items: {
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: 2
  },
  item_correction: {
    width: '60%',
    height: '100%',
    flexDirection: 'row',
    paddingLeft: 5,
    paddingTop: 5
  },
  detail_correction: {
    alignItems: 'flex-start',
    padding: 5
  },
  info_correction: {
    paddingLeft: 5,
    paddingTop: 5
  },
  att_correction: {
    width: '40%',
    height: '100%',
    padding: 5,
    paddingLeft: 5
  }
  ,
  loading_content: {
    width: '100%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty_data: {
    height: 400,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const {
  containers,
  content_header,
  on_option,
  body_content,
  item_content,
  loading_content,
  item_header,
  empty_data,
  item_text,
  text_head,
  text_date,
  body_items,
  item_correction,
  detail_correction,
  info_correction,
  att_correction
} = styles;


export const FilterCorrectionContainers = ({ navigation }) => {
  const [ getFiltering, { data: filter, loading, error } ] = useLazyQuery( Query.FILTER_CORRECTION );
  
  useEffect(() => {
    (async() => {
      await _onFetchingData( 'req' )
    })()
  }, [])

  const _onFetchingData = async key => {
    const { code, token } = await getAccess();
    await getFiltering({ variables: { code, token, key } })
  }

  console.log( filter );

  return (
    <View style={ containers }>
      <View style={ content_header }>
        { ['Request', 'Accept', 'Decline'].map((el, i) => (
            <View style={ on_option } key={ i }>
              <Text> { el } </Text>
            </View>
        ))}
      </View>
      <ScrollView style={ body_content }>
        { loading
            &&  <View style={ loading_content }>
                  <ActivityIndicator size='large' color='black' />
                </View> }
        { filter && filter.filterCorrection 
            ? filter.filterCorrection.map(el => (
                <View style={{ ...item_content, backgroundColor: el.status === 'acc' ? '#deff8b' : el.status === 'dec' ? '#f4dada' : '#edf7fa' }}>
                  <View style={ item_header }>
                    <View style={ item_text }>
                      <Text style={ text_head }>Create At</Text>
                      <Text style={ text_date }>{ el.createdAt ? convertDate( el.createdAt ) : ' - ' }</Text>
                    </View>
                    <View style={ item_text }>
                      <Text style={ text_head }>Last Update</Text>
                      <Text style={ text_date }>{ el.updatedAt ? convertDate( el.updatedAt ) : ' - ' }</Text>
                    </View>
                  </View>

                  <View style={ body_items }>
                    <View style={ item_correction }>
                      <Image source={ el.image ? { uri: el.image } : require('../../../../assets/NoCamera.png') } style={{ height: 80, width: 80, borderRadius: 8 }} />
                      <View style={ detail_correction }>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{ el.status === 'req' ? 'Request Process' : el.status === 'acc' ? 'You\re request accepted' : 'You\re request decline' }</Text>
                        <View style={ info_correction }>
                          { ['Check In', 'Check Out', 'Reason'].map((map, i) => (
                              <Text style={ text_head } key={ i }>
                                { map }: &nbsp;
                                <Text style={{ color: 'black', fontSize: 12 }}>
                                  { map === 'Check In' && el.start_time
                                      ? el.start_time
                                      : map === 'Check Out' && el.end_time
                                          ? el.end_time
                                          : map === 'Reason' && el.reason 
                                              ? el.reason
                                              : ' - ' }
                                </Text>
                              </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                    <View style={ att_correction }>
                      <Text style={ text_head }>Before</Text>
                      <View style={ info_correction }>
                        { ['Check In', 'Check Out'].map((map, i) => (
                            <Text style={ text_head } key={ i }>
                              { map }: &nbsp;
                              <Text style={{ color: 'black', fontSize: 12 }}>
                                { map === 'Check In' && el.AttId && el.AttId.start
                                    ? el.AttId.start
                                    : map === 'Check Out' && el.AttId && el.AttId.end_time
                                        ? el.AttId.end_time
                                        : ' - ' }
                              </Text>
                            </Text>
                        ))}
                      </View>
                      <Text>133</Text>
                    </View>
                  </View>
                </View>
            ))
            : <View style={ empty_data } >
                <Text>NO Data</Text>
              </View>}
      </ScrollView>
    </View>
  )
}



const convertDate = date => new Date( date ).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }).replace(', ','-')