import React, { useState, useEffect } from 'react';
import { View, Animated, Text, TouchableOpacity, ActivityIndicator, Platform, Image, Alert } from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Query, Mutation } from '../../graph';
import { MapCorrections } from '../../components/Detail';
import { AdminStyle } from '../../components/Admin/AdminComponentStyle';
import { getAccess } from '../../service';

const {
  containers,
  before_content,
  loading_text,
  header_fade_view,
  header_text,
  body_content,
  content_detail,
  detail_header,
  detail_header_text,
  detail_header_create,
  content_before,
  before_text,
  before_body,
  before_main,
  main_text,
  main_times,
  content_after,
  content_footer,
  footer_text,
  footer_content,
  content_image,
  image_footer,
  image_text,
  reason_footer,
  reason_text,
  right_content,
  content_maps,
  invalid_maps,
  body_att_reason,
  list_images,
  images_check,
  size_image,
  text_no_image,
  footer_list_content,
  footer_reason_list,
  loading_touchable,
  touchable_response,
  main_loading_touchable,
  content_loading_touchable
}=AdminStyle
//id, code, token, pin
export const DetailAdminContainers = ({ navigation: { state: { params }, goBack } }) => {
  const [ fetch, { data: el, loading } ] = useLazyQuery( Query.GET_CORRECTION_ID );
  const [ response ] = useMutation( Mutation.RES_CORRECTION );
  const [ message, setMessage ] = useState( false );

  const [ acceptLoading, setAcceptLoading ] = useState( false );
  const [ rejectLoading, setRejectLoading ] = useState( false );
  

  const _onClear = meth => setTimeout(() => meth( false ), 2000);

  const _onResponseReq = async status => {
    if( status ) {
      setAcceptLoading( true );
      await _onSubmitResponse( 'acc' );
      setAcceptLoading( false );
    }else{
      setRejectLoading( true );
      await _onSubmitResponse( 'dec' );
      setRejectLoading( false );
    }
  }

  const _onSubmitResponse = async res => {
    try{
      const { id, pin } = params;
      const { code, token } = await getAccess();
      const { data: { responseCorrection } } = await response({ variables: { code, token, id, res, pin_security: pin } })
      if( responseCorrection ) {
        Alert.alert('Attention',`you ${ res === 'acc' ? 'accept' : 'reject' } this Correction`);
        setTimeout(() => {
          goBack();
        }, 2000)
        // next sprint send notification to this User
      }
    }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); _onClear( setMessage );}
  }

  useEffect(() => {
    (async () => {
      const { id } = params;
      const { code, token } = await getAccess();
      try { await fetch({ variables: { code, token, id } }); }
      catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); _onClear( setMessage );}
    })()
  }, [])

  return (
    <View style={ containers }>
        { loading && !message
            ? (<View style={ before_content }>
                <ActivityIndicator color='black' />
                <Text style={ loading_text }>
                  Loading...
                </Text>
              </View>)
            : null }
        { message && !loading
            ? (<View style={ before_content }>
                <Text style={ header_fade_view }>{ message }</Text>
              </View>) : null }
        { el && el.getOneCorrection && !loading && !message
            ? 
            <>
              <View style={ header_fade_view }>
                <Text style={ header_text }>
                  Response Request
                </Text>
              </View>
              <View style={ body_content }>
                <View style={ content_detail }>
                  <View style={ detail_header }>
                    <Text style={ detail_header_text }>Request Created</Text>
                    <Text style={ detail_header_create }>
                      { el.getOneCorrection.createdAt
                          ? `${ new Date( el.getOneCorrection.createdAt ).toDateString('en-US',{ timeZone: 'Asia/Jakarta' }) } ${ new Date( el.getOneCorrection.createdAt ).toLocaleTimeString('en-US',{ timeZone: 'Asia/Jakarta' })}`
                          : 'Invalid Date' }
                    </Text>
                  </View>
                  <View style={ content_before }>
                    <Text style={ before_text }>Before</Text>
                    <View style={ before_body }>
                      { ['Check In', 'Check Out'].map((map, i) => (
                          <View style={ before_main } key={ i }>
                            <Text style={ main_text }>{ map }</Text>
                            <Text style={ main_times }>
                              { map === 'Check In' && el.getOneCorrection.AttId && el.getOneCorrection.AttId.start
                                  ? el.getOneCorrection.AttId.start
                                  : map === 'Check Out' && el.getOneCorrection.AttId && el.getOneCorrection.AttId.end
                                      ? el.getOneCorrection.AttId.end
                                      : ' - '}
                            </Text>
                          </View>
                      ))}
                    </View>
                  </View>
                  <View style={ content_after }>
                    <Text style={ before_text }>After</Text>
                    <View style={ before_body }>
                      { ['Check In', 'Check Out'].map((map, i) => (
                          <View style={ before_main } key={ i }>
                            <Text style={ main_text }>{ map }</Text>
                            <Text style={ main_times }>
                              { map === 'Check In' && el.getOneCorrection && el.getOneCorrection.start_time
                                  ? el.getOneCorrection.start_time
                                  : map === 'Check Out' && el.getOneCorrection.end_time
                                      ? el.getOneCorrection.end_time
                                      : ' - '}
                            </Text>
                          </View>
                      ))}
                    </View>
                  </View>
                  
                  <View style={ content_footer }>
                    <Text style={ footer_text }>More Info</Text>
                    <View style={ footer_content }>
                      <View style={ content_image }>
                        { el.getOneCorrection.image
                            ? <Image source={{ uri: el.getOneCorrection.image }} style={ image_footer } />
                            : <Text style={ image_text }>No Image</Text> }
                      </View>
                      <View style={ reason_footer }>
                        <Text style={ reason_text }>Reason Correction</Text>
                        { el.getOneCorrection.reason
                            ? <Text style={{ marginTop: 2, ...reason_text, color: 'black' }}>{ el.getOneCorrection.reason }</Text>
                            : <Text style={{ marginTOp: 2, ...reason_text, color: 'black' }}>No Reason</Text> }
                      </View>
                    </View>
                  </View>
                </View>

                <View style={ right_content }>
                  <View style={ content_maps }>
                    { el.getOneCorrection.AttId && el.getOneCorrection.AttId.start_location && el.getOneCorrection.AttId.end_location
                        ? <MapCorrections start={ el.getOneCorrection.AttId.start_location } end={ el.getOneCorrection.AttId.end_location } />
                        : <Text style={ invalid_maps }>NO LOCATION</Text>}
                  </View>
                  <View style={ body_att_reason }>
                    <View style={ list_images }>
                      { ['1', '2'].map((map, i) => (
                          <View style={ images_check } key={ i }>
                            { map === '1' && el.getOneCorrection.AttId && el.getOneCorrection.AttId.start_image
                                ? <Image source={{ uri: el.getOneCorrection.AttId.start_image }} style={ size_image } />
                                : map === '2' && el.getOneCorrection.AttId && el.getOneCorrection.end_image 
                                    ? <Image source={{ uri: el.getOneCorrection.AttId.end_image }} style={ size_image } />
                                    : <Text style={ text_no_image }>No Image</Text> }
                          </View>
                      ))}
                    </View>
                    <View style={ footer_list_content }>
                      { ['Start Reason', 'End Reason'].map((map, i) => (
                          <View style={ footer_reason_list } key={ i }>
                            <Text style={{ ...footer_text, height: 13 }}>{ map }</Text>
                            { map === 'Start Reason' && el.getOneCorrection.AttId && el.getOneCorrection.AttId.start_reason
                                ? <Text style={{ ...footer_text, height: 15, color: 'black' }}>{ el.getOneCorrection.AttId.start_reason }</Text>
                                : map === 'End Reason' && el.getOneCorrection.AttId && el.getOneCorrection.AttId.end_reason
                                    ? <Text style={{ ...footer_text, height: 15, color: 'black' }}>{ el.getOneCorrection.AttId.end_reason }</Text>
                                    : <Text style={{ ...footer_text, height: 15, color: 'black' }}>No Reason</Text>}
                          </View>
                      ))}
                    </View>
                  </View>
                </View>
                
              </View>
              <View style={ main_loading_touchable }>
                <View style={ content_loading_touchable }>
                  { !acceptLoading
                      ? <TouchableResponse action={ _onResponseReq } text='Accept' />
                      : <LoadingTouchable />  }
                  
                </View>
                <View style={ content_loading_touchable }>
                  { !rejectLoading
                      ? <TouchableResponse action={ _onResponseReq } text='Reject' />
                      : <LoadingTouchable />  }
                </View>
              </View>
            </>
            : !loading && !message
                ? <Text>Empty Data</Text>
                : null }
    </View>
  )
}

const TouchableResponse = ({ action, text }) => (
  <TouchableOpacity onPress={() => action( text === 'Accept' ? true : false )} style={{ ...touchable_response, backgroundColor: text === 'Accept' ? '#a7e9af' : 'salmon' }}>
    <Text style={{ fontSize: Platform.OS === 'android' ? 25 : 30, fontWeight: 'bold', color: text === 'Accept' ? 'black' : 'white' }}>{ text }</Text>
  </TouchableOpacity>
)

const LoadingTouchable = _ => (
  <TouchableOpacity style={ loading_touchable }>
    <ActivityIndicator color='white' size='small' />
  </TouchableOpacity>
)

// 18 feb melanjutkan action accept or reject 