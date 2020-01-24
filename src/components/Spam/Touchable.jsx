import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export const TouchComponent = ({ press, h, w, text, color, textColor, bold, fromDash, type, id , size, spacing, issues, isuMessage }) => (
  <TouchableOpacity
    onPress={ async () => {
      if( type === 'checkin' ) fromDash( 'Absent' );
      else if( type === 'checkout' ) {
        const { msg } = await checkTime();
        console.log( msg, issues )
        if( msg === 'ok' || issues.length > 5 ) {
          isuMessage( false );
          fromDash( 'Checkout', { id, issues } );
        }
        else if( issues.length < 6 ) isuMessage( { msg : 'Reason Min 6 Char' } )
        else if( msg === 'issues' ) isuMessage( true );
      }
      else press();
    }}
    style={{ height: h, width: w, justifyContent: 'center', alignItems: 'center', backgroundColor: color ? color : '#FFCC99', borderRadius: 20 }}
    >
    <Text style={{ color: textColor ? textColor : 'black', fontWeight: bold && 'bold', fontSize: size && size, letterSpacing: spacing ? spacing : 0 }}>{ text }</Text>
  </TouchableOpacity>
)

const checkTime = () => {
  return new Promise((resolve) => {
    console.log( new Date().toLocaleTimeString().split(':')[0] )
    if( new Date().toLocaleTimeString().split(':')[0] < '17' ){
      resolve({ msg: 'issues' })
    }else resolve({ msg: 'ok' })
  })
}