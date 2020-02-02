import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Signin, Forgot, Dash, History, Absent, CheckOutComponent, DetailContainers, ImageContainers, ProfileContainers, ChangePasswordContainers, FilterContainers, LiveAttContainers, CheckContainers } from './src/containers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { HeaderComponent } from './src/components'
import { Platform } from 'react-native';

const StackSigninNavigation = createStackNavigator({
  Signin: { screen: Signin, navigationOptions: { header: null } },
  Forgot: { screen: Forgot, navigationOptions: { title: 'Forgot Password' } }
}, { initialRouteName: 'Signin' })


const StackHistoryNavigation = createStackNavigator({
  History: { screen: History, navigationOptions: { header: null } },
  Detail: { screen: DetailContainers, navigationOptions: { header: ({ scene }) => <HeaderComponent mid={{ msg: scene.descriptor.navigation.state.params.date }} online={ true } left={{ icon: 'arrow-left', action: scene.descriptor.navigation.goBack, top: Platform.OS === 'android' ? 16 : 0}} /> } },
  Image: { screen: ImageContainers },
  Filter: { screen: FilterContainers, navigationOptions: { title: 'Filter Search' } }
})


const StackDashBoardNavigation = createStackNavigator({
  Home: { screen: Dash, navigationOptions: { header: null } },
  LiveAtt: { screen: LiveAttContainers, navigationOptions: { title: 'Live Attendance' } },
  Checkin: { screen: Absent, navigationOptions: { title: 'Check In' } },
  History: { screen: StackHistoryNavigation, navigationOptions: { header: null } },
  Checkout: { screen: CheckOutComponent, navigationOptions: { header: null } },
  PreCheck: { screen: CheckContainers }
})

const StackProfileNavigation = createStackNavigator({
  Profile: { screen: ProfileContainers, navigationOptions: { header: null } },
  Change: { screen: ChangePasswordContainers }
})

// const StackAbsentProcess = createStackNavigator({
//   Absent: { screen: Absent, navigationOptions: { header: null } }
// }, { initialRouteName: 'Absent' })

const TabsNavigation = createBottomTabNavigator({
  DashBoard: {
    screen: StackDashBoardNavigation,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <FontAwesome5 name={'home'} color={ tintColor } />,
      title: 'Home'
    }
  },
  Profile: {
    screen: StackProfileNavigation,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <FontAwesome5 name={ 'user' } color={ tintColor } />,
      title: 'Profile'
    }
  }
})

const SwitchNavigation = createSwitchNavigator({
  Home: { screen: StackSigninNavigation },
  DashBoard: { screen: TabsNavigation }
}, { initialRouteName: 'Home' })

export default createAppContainer( SwitchNavigation );