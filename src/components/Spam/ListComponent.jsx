import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Platform, TouchableOpacity } from 'react-native';
import { TouchComponent, LoadingComponent } from '../Spam';
import Font from 'react-native-vector-icons/FontAwesome5';

export const ListComponent = ({ load, image, size, name, role, date, startTime, message, action, type, startIssues, id, daily, mr, justy, bc, typeParent }) => {
  const [ issueM, setIssueM ] = useState( false );
  const [ issues, setIssues ] = useState( false );

  useEffect(() => {
    setIssueM( false );
  }, [])

  return (
    <>
      <View style={{ borderWidth: 1, width: '96%', borderColor: '#90b8f8', backgroundColor: '#90b8f8', height: typeParent ? Platform.OS === 'android' ? 180 : 150 : 150, marginTop: typeParent ? 10 : 5, padding: 10, alignItems: 'center',justifyContent: 'space-around', borderRadius: 20 }}>
        {
          load
            ? <LoadingComponent
                color={ 'blue' }
                pos={ 'relative' }
                s={ 'large' }
                index={ 20 }
                />
            :
            daily === 'ok'
              ?
              <>
                <View style={{ width: '99%', height: 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Text>See you Tommorow</Text>
                </View>
              </>
              :
              <>
                <View style={{ borderBottomColor: bc ? bc : '#f6e58d', borderBottomWidth: 1, width: '99%', height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {
                  image && name && role && startTime
                    ?
                      <>
                        <View style={{ flex: 0.7, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: justy ? justy : 'space-around' }}>
                          <Image source={{ uri: image && image }} style={{ height: 40, width: 40, borderRadius: 20, marginLeft: 20 }} />
                          <View style={{ marginRight: mr && mr }}>
                            <Text style={{ fontSize: size.name, fontWeight: 'bold' }}>{ name.toUpperCase() }</Text>
                            <Text style={{ fontSize: size.role, fontWeight: 'bold' }}>{ role }</Text>
                          </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: size.date, fontWeight: 'bold' }}>{ date }</Text>
                        </View>
                      </>
                    : typeParent && typeParent.name === 'history'
                        ?
                        <>
                          {
                            typeParent.message
                              ? <Text>Belum ada History</Text>
                              : 
                                <>
                                  <View style={{ flex: 0.7, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: justy ? justy : 'space-around' }}>
                                    <Image source={{ uri: typeParent.image && typeParent.image }} style={{ height: 40, width: 40, borderRadius: 20, marginLeft: 20 }} />
                                    <View style={{ marginRight: mr && mr }}>
                                      <Text style={{ fontSize: size.name, fontWeight: 'bold' }}>{ typeParent.username.toUpperCase() }</Text>
                                      <Text style={{ fontSize: size.role, fontWeight: 'bold' }}>{ typeParent.role }</Text>
                                    </View>
                                  </View>
                                  <View style={{ marginBottom: 10 }}>
                                    <Text style={{ fontSize: size.date, fontWeight: 'bold' }}>{ typeParent.date }</Text>
                                  </View>
                                </>
                          }
                        </>
                        : typeParent.empty
                            ? <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                <Text style={{ fontWeight: 'bold', letterSpacing: 2 }}> No History </Text>
                              </View>
                            : <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                <Text style={{ fontWeight: 'bold', letterSpacing: 2 }}> PRESENT NOW </Text>
                              </View>
                }
                </View>
                <View style={{ width: '99%', height: typeParent ? 40 : 30, flexDirection: 'row', alignItems: 'center', justifyContent: typeParent ? 'space-around' : 'center' }}>
                  {
                    typeParent && typeParent.name === 'history'
                      ?
                        <>
                          <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center', backgroundColor: typeParent.startIssues === 'ok' ? '#deff8b' : typeParent.startIssues === 'warning' ? '#f6eec7' : '#ec7373', borderColor: '#c7ecee', borderWidth: 1, borderRadius: 20, height: Platform.OS === 'android' ? 70 : 60 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' && 12 }}>Check In</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: size.time, color: 'blue' }}>{ typeParent.startTime }</Text>
                            <Text style={{ fontSize: Platform.OS === 'android' ? 8 : 10, color: 'black', fontWeight: 'bold', letterSpacing: 1 }}>{ typeParent.startIssues.toUpperCase() }</Text>
                          </View>
                          <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center', backgroundColor: typeParent.endIssues === 'ok' ? '#deff8b' : typeParent.endIssues === 'warning' ? '#f6eec7' : '#ec7373', borderColor: '#c7ecee', borderWidth: 1, borderRadius: 20, height: Platform.OS === 'android' ? 70 : 60 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' && 12 }}>Check Out</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: size.time, color: 'blue' }}>{ typeParent.endTime }</Text>
                            <Text style={{ fontSize: Platform.OS === 'android' ? 8 : 10, color: 'black', fontWeight: 'bold' }}>{ typeParent.endIssues.toUpperCase() }</Text>
                            <Text style={{ fontSize: Platform.OS === 'android' ? 5 : 7, color: 'red', fontWeight: 'bold' }}>{ typeParent.reason.toUpperCase() }</Text>
                          </View>
                          <TouchableOpacity style={{ flex: 0.12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#26282b', borderColor: '#26282b', borderWidth: 1, borderRadius: 20, height: 50 }}>
                            <Font name='map' size={ 20 } color={ 'white' }/>
                          </TouchableOpacity>
                        </>
                      :
                      <>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c7ecee', borderColor: '#c7ecee', borderWidth: 1, borderRadius: 20, height: 55 }}>
                          { name && <Text style={{ fontWeight: 'bold' }}>Check In</Text> }
                          <Text style={{ fontWeight: 'bold', fontSize: size.time, color: 'blue' }}>{ startTime }</Text>
                        </View>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'space-between' }}>
                          <TouchComponent w={ 100 } h={ 35 } color={ '#c7ecee' } textColor='#e056fd' text={ message } bold={ 'bold' } fromDash={ action } id={ id } type={ type } issues={ issues } isuMessage={ setIssueM }/>
                          { startIssues ? <Text style={{ fontSize: 8, marginTop: 5 }}>Issues: <Text style={{ color: startIssues === 'ok' ? 'green' : startIssues === 'warning' ? 'yellow' : 'red' }}>{ startIssues.toUpperCase() }</Text></Text>
                            : startIssues === '' && <Text style={{ fontSize: 8, marginTop: 5 }}>Issues: <Text style={{ color: 'red' }}>Failed Location</Text></Text>}
                        </View>
                      </>
                  }
                </View>
              </>
        }
      </View>
      {
        issueM
          &&  <View style={{ backgroundColor: '#b9cced', borderRadius: 20, marginTop: 20, alignItems: 'center', justifyContent: 'center', height: 100, width: '99%' }}>
                <Text style={{ color: 'red', fontSize: Platform.OS === 'android' ? 15 : 18 }}>{ issueM.msg ? issueM.msg : `It's not time to go home yet, give us a reason` }</Text>
                <TextInput placeholder={ 'Reason' } placeholderTextColor={ 'white' } style={{ fontWeight: 'bold', color: 'white', letterSpacing: 2, width: '50%', marginTop: 10, textAlign: 'center' }} fontSize={ Platform.OS === 'android' ? 15 : 20} onChangeText={ msg => setIssues( msg ) }/>
              </View>
      }
    </>
  )
}