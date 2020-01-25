import React from 'react';
import { createAppContainer, createSwitchNavigator, ThemeColors } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Signin, Forgot, Dash, History, Process, Result, Absent, CheckOutComponent, MapContainers } from './src/containers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const StackSigninNavigation = createStackNavigator({
  Signin: { screen: Signin, navigationOptions: { header: null } },
  Forgot: { screen: Forgot, navigationOptions: { title: 'Forgot Password' } }
}, { initialRouteName: 'Signin' })

const StackDashBoardNavigation = createStackNavigator({
  Home: { screen: Dash, navigationOptions: { header: null } },
  Checkout: { screen: CheckOutComponent, navigationOptions: { header: null } }
})

const StackHistoryNavigation = createStackNavigator({
  History: { screen: History, navigationOptions: { header: null } },
  Maps: { screen: MapContainers }
})

const DrawerNavigation = createDrawerNavigator({
  Home: { screen: StackDashBoardNavigation },
  History: { screen: StackHistoryNavigation }
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