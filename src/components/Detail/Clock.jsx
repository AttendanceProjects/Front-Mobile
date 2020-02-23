import React from 'react';
import { View, Image, TouchableOpacity, Platform, Text } from 'react-native';
import { DetailStyle } from './DetailStyle';

const {
  content_header,
  image_header,
  font_small,
  content_header_right,
  font_clock
} = DetailStyle

export const ClockComponent = ({ nav, image, issues, time }) => {

  const _onChangePage = type => {
    if( type === 'start' ) nav( 'Image', { url: image.start } );
    else nav( 'Image', { url: image.end } );
  }

  return (
    <>
      <View style={ content_header }>
        { image && image.start
            ? <TouchableOpacity onPress={() => _onChangePage( 'start' )}>
                <Image source={{ uri: image.start }} style={ image_header } />
              </TouchableOpacity> : null}
        <View>
          <Text style={ font_small }>Check In</Text>
          {  issues && issues.start
              ? <Text style={{ ...font_clock, color: issues.start === 'ok' ? '#a7e9af' : issues.start === 'warning' ? '#fdd365' : '#ce0f3d' }}>{ time.start && time.start }</Text> : null}
        </View>
      </View>
      <View style={ content_header_right }>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ ...font_small, marginRight: 10 }}>Checkout</Text>
          {  issues && issues.end
              ? <Text style={{ ...font_clock, marginRight: 10, color: issues.end === 'ok' ? '#a7e9af' : issues.end === 'warning' ? '#fdd365' : '#ce0f3d' }}>{ time.end && time.end }</Text> : null}
        </View>
        { image && image.end
            ? <TouchableOpacity onPress={() => _onChangePage( 'end' )}>
                <Image source={{ uri: image.end }} style={ image_header } />
              </TouchableOpacity> : null }
      </View>
    </>
  )
}