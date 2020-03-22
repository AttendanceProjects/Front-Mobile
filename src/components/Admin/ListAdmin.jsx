import React from 'react';
import { View, Text, TouchableOpacity , ActivityIndicator } from 'react-native';
import { AdminStyle } from './AdminComponentStyle';

const {
  admin_button,
  list_content_left,
  content_admin,
  font_list_small,
  body_content,
  font_list_medium,
  user_info_content,
  att_info_user,
  att_check_info,
  list_data_content,
  item_body_message,
  main_items_admin
} = AdminStyle

export const ListComponentAdmin = ({ item, loading, action }) => (
  <TouchableOpacity onPress={ () => action( true, item._id ) } style={ admin_button }>
    <View style={ list_content_left }>
      { loading
          ? <LoadingLocal />
          : <>
              <View style={ content_admin }>
                <Text style={ font_list_small }>
                  Created At: &nbsp;
                </Text>
                <Text style={ font_list_medium }>
                  {item.createdAt && !loading
                    ? new Date( item.createdAt ).toDateString('en-US', {timeZone: 'Asia/Jakarta'})
                    : ' - ' }
                </Text>
              </View>
              <View style={ content_admin }>
                <Text style={ font_list_small }>
                  Reason &nbsp; 
                </Text>
                <Text style={ font_list_medium }>
                  {item.reason && !loading
                    ? item.reason
                    : ' - '}
                </Text>
              </View>
            </> }
    </View>
    <View style={{ ...body_content, padding: 0 }}>
      { loading
          ? <LoadingLocal />
          : <>
              <View style={ user_info_content }>
                { ['Username', 'email', 'phone'].map((li, i) => <ListDataComponent loading={ loading } item={ li } key={ i } data={ item.UserId } />)}
              </View>
              <View style={ att_info_user }>
                <Text style={ font_list_small }>Request</Text>
                <View style={ att_check_info }>
                  <Text style={ font_list_medium }>
                    { item.start_time && !loading
                        ? item.start_time
                        : ' - '}
                  </Text>
                  <Text style={ font_list_medium }>
                    { item.end_time && !loading
                        ? item.end_time
                        : ' - '}
                  </Text>
                </View>
              </View>
            </> }
    </View>
  </TouchableOpacity>
)


const ListDataComponent = ({ item, data, loading }) => (
  <View style={ list_data_content }>
    <View style={ item_body_message }>
      <Text style={ font_list_small }>{ item }: &nbsp; </Text>
    </View>
    <View style={ main_items_admin }>
      <Text style={ font_list_medium }>
        { item === 'Username' && data && data.username && !loading
            ? data.username.toUpperCase()
            : item === 'email' && data && data.email && !loading
                ? (data.email.length > 21 ? `${ data.email.slice(0, 21) }...` : data.email )
                : item === 'phone' && data && data.phone && !loading
                    ? data.phone
                    : ' - '}
      </Text>
    </View>
  </View>
)

const LoadingLocal = _ => <ActivityIndicator color='black' size='small' />
