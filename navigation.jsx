import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Signin, Forgot, Dash, History, Absent, Process, Result } from './src/containers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const StackSigninNavigation = createStackNavigator({
  Signin: { screen: Signin, navigationOptions: { header: null } },
  Forgot: { screen: Forgot, navigationOptions: { title: 'Forgot Password' } }
}, { initialRouteName: 'Signin' })

const DrawerNavigation = createDrawerNavigator({
  Home: { screen: Dash },
  History: { screen: History }
})

const StackAbsentProcess = createStackNavigator({
  Absent: { screen: Absent, navigationOptions: { header: null } },
  Process: { screen: Process, navigationOptions: { header: null } },
  Result: { screen: Result, navigationOptions: { header: null } }
}, { initialRouteName: 'Absent' })

const TabsNavigation = createBottomTabNavigator({
  DashBoard: {
    screen: DrawerNavigation,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <FontAwesome5 name={'home'} color={ tintColor } />,
      title: 'Home'
    }
  },
  Absent: {
    screen: StackAbsentProcess,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <FontAwesome5 name={ 'plus' } color={ tintColor } />,
      title: 'Absent'
    }
  }
})

const SwitchNavigation = createSwitchNavigator({
  Home: { screen: StackSigninNavigation },
  DashBoard: { screen: TabsNavigation }
}, { initialRouteName: 'Home' })

export default createAppContainer( SwitchNavigation );