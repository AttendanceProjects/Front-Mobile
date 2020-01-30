import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Platform } from 'react-native';
import { TouchComponent, LoadingComponent } from '../Spam';

import { BtmListComponent, TopListComponent } from '../ListPerComponent'

export const ListComponent = ({ nav, load, image, size, name, role, date, startTime, message, action, type, setMsg, startIssues, id, daily, mr, justy, bc, typeParent }) => {
  const [ issueM, setIssueM ] = useState( false );
  const [ issues, setIssues ] = useState( '' );

  useEffect(() => {
    console.log( size, type )
    setIssueM( false );
  }, [])

  return (
    <>
      <View style={{ borderWidth: 1, width: typeParent ? "98%" : '96%', borderColor: '#90b8f8', backgroundColor: '#90b8f8', height: Platform.OS === 'android' ? 140 : 140, marginTop: typeParent ? 10 : 5, padding: 10, alignItems: 'center',justifyContent: 'space-around', marginLeft: typeParent && 2.5, borderRadius: 20 }}>
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
                  <Text style={{ fontSize: 20, color: 'blue' }}>You allready checkin today</Text>
                  <Text style={{ fontSize: 20, color: 'blue' }}>See you tommorow</Text>
                </View>
              </>
              :
              <>
                <View style={{ borderBottomColor: bc ? bc : !typeParent ? '#f6e58d' : null, borderBottomWidth: !typeParent ? 1 : null, width: '99%', height: typeParent ?  typeParent && Platform.OS === 'android' ? 20 : 40 : 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {
                  image && role && startTime
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
                          <TopListComponent
                            size={{
                              role: size.role,
                              name: size.name,
                              date: size.date
                            }}
                            typeParent={{
                              username: typeParent.username,
                              role: typeParent.role,
                              date: typeParent.date
                            }}
                            justy={ justy }
                            nav={ nav }
                            data={ typeParent }
                          />
                        :
                          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                            <Text style={{ fontWeight: 'bold', letterSpacing: 2 }}> PRESENT NOW </Text>
                          </View>
                }
                </View>
                <View style={{ width: '99%', height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: typeParent ? 'space-around' : 'center', marginBottom: typeParent ? 15 : 0 }}>
                  {
                    typeParent && typeParent.name === 'history'
                      ?
                        <BtmListComponent
                          typeParent={{
                            startTime: typeParent.startTime,
                            startIssues: typeParent.startIssues,
                            endIssues: typeParent.endIssues,
                            endTime: typeParent.endTime,
                            endIssues: typeParent.endIssues,
                            reason: {
                              end: typeParent.reason.end
                            },
                            date: typeParent.date
                          }}
                          size={{
                            time: size.time,
                          }}
                          nav={ nav }
                        />
                      :
                      <>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c7ecee', borderColor: '#c7ecee', borderWidth: 1, borderRadius: 20, height: 50 }}>
                          { name && <Text style={{ fontWeight: 'bold' }}>Check In</Text> }
                          <Text style={{ fontWeight: 'bold', fontSize: size.time, color: 'blue' }}>{ startTime }</Text>
                        </View>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'space-between' }}>
                          <TouchComponent w={ 100 } h={ 35 } color={ '#c7ecee' } textColor='#e056fd' text={ message } bold={ 'bold' } fromDash={ action } id={ id } type ={ type  } issues={ issues } isuMessage={ setIssueM } setMsg={ setMsg }/>
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