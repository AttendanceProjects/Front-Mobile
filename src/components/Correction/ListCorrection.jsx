import React from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator} from 'react-native';
import { ListStyle } from './ListCorrectionStyle';

const {
  container_touchable,
  content_touchable,
  body_correction,
  date_correction,
  font_date,
  main_detail_correction,
  font_small,
  font_medium,
  content_loading_correction
} = ListStyle;

export const ListCorrectionComponent = ({ item, checkAvailable, loadingCheck, message }) => (
  <TouchableOpacity style={ container_touchable } onPress={_ => checkAvailable( item._id )}>
    <View style={ content_touchable }>
      <View style={{ ...body_correction, height: message ? '80%' : '100%' }} >
        <View style={ date_correction }>
          <Text style={ font_date }>{ item.date }</Text>
        </View>
        <View style={ main_detail_correction }>
          <Text style={ font_small }>Check In : <Text style={ font_medium }>{ item.start }</Text></Text>
          <Text style={ font_small }>Check Out : <Text style={ font_medium }>{ item.end }</Text></Text>
        </View>
        { loadingCheck
          &&  <View style={ content_loading_correction }>
                <ActivityIndicator color={ 'red' } />
              </View> }
      </View>
    </View>
  </TouchableOpacity>
)