import React from 'react';
import { View, Platform } from 'react-native';
import { LoadingListComponent } from './Loading';

import { BtmListComponent, TopListComponent } from '../ListPerComponent'


export const ListHistoryFilterComponent = ({ load, bc, justy, size, typeParent }) => (
  <View style={{ borderWidth: 1, width: typeParent ? "98%" : '96%', borderColor: '#90b8f8', backgroundColor: '#90b8f8', height: Platform.OS === 'android' ? 140 : 140, marginTop: typeParent ? 10 : 5, padding: 10, alignItems: 'center',justifyContent: 'space-around', marginLeft: typeParent && 2.5, borderRadius: 20 }}>
    {
      load
        ? <LoadingListComponent
            color={ 'blue' }
            s={ 'large' }
            index={ 20 }
            />
        :
        <>
          <View style={{ borderBottomColor: bc ? bc : !typeParent ? '#f6e58d' : null, borderBottomWidth: !typeParent ? 1 : null, width: '99%', height: typeParent ?  typeParent && Platform.OS === 'android' ? 20 : 40 : 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
            />
          </View>
          <View style={{ width: '99%', height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: typeParent ? 'space-around' : 'center', marginBottom: typeParent ? 15 : 0 }}>
            <BtmListComponent
              typeParent={{
                startTime: typeParent.startTime,
                startIssues: typeParent.startIssues,
                endIssues: typeParent.endIssues,
                endTime: typeParent.endTime,
                endIssues: typeParent.endIssues,
                reason: {
                  start: typeParent.reason.start,
                  end: typeParent.reason.end
                },
                type: typeParent.type,
                date: typeParent.date
              }}
              size={{
                time: size.time,
              }}
            />
          </View>
        </>
    }
  </View>
)