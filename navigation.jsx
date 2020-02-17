import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {
  Signin,
  Forgot,
  Dash,
  History,
  Absent,
  CheckOutComponent,
  DetailContainers,
  ImageContainers,
  ProfileContainers,
  ChangePasswordContainers,
  FilterContainers,
  LiveAttContainers,
  CheckContainers,
  CorrectionContainers,
  CreateCorrectionContainers,
  FormCorrectionContainers,
  EmployeeContainers,
  FilterEmployeeContainers,
  GetAllCorrection,
  PrepareApplication
} from './src/containers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const StackSigninNavigation = createStackNavigator({
  Signin: { screen: Signin, navigationOptions: { header: null } },
  Forgot: { screen: Forgot, navigationOptions: { title: 'Forgot Password' } }
}, { initialRouteName: 'Signin' })


const StackHistoryNavigation = createStackNavigator({
  History: { screen: History, navigationOptions: { header: null } },
  Detail: {
    screen: DetailContainers,
    navigationOptions: {
      header: null
    }
  },
  Image: { screen: ImageContainers },
  Filter: { screen: FilterContainers, navigationOptions: { header: null  } }
})

const StackCreateCorrectionNavigation = createStackNavigator({
  Create: { screen: CreateCorrectionContainers, navigationOptions: { header: null } },
  Form: { screen: FormCorrectionContainers, navigationOptions: { header: null } }
})

const CorrectionDrawerNavigation = createDrawerNavigator({
  All: { screen: CorrectionContainers, navigationOptions: { title: 'Home' } },
  Create: { screen: StackCreateCorrectionNavigation, navigationOptions: { title: 'New Request' } }
})


const StackDashBoardNavigation = createStackNavigator({
  Home: { screen: Dash, navigationOptions: { header: null } },
  LiveAtt: { screen: LiveAttContainers, navigationOptions: { title: 'Live Attendance' } },
  Checkin: { screen: Absent, navigationOptions: { title: 'Check In' } },
  History: {
    screen: StackHistoryNavigation,
    navigationOptions: ({ navigation }) => ({
      headerRight: (
          <FontAwesome5 name={ 'search' } size={ 20 } color={ 'white' } style={{ marginRight: 20 }} onPress={() => navigation.navigate( "Filter" ) }/>
      ),
    })
  },
  Checkout: { screen: CheckOutComponent },
  PreCheck: { screen: CheckContainers },
  Correction: {
    screen: CorrectionDrawerNavigation,
    navigationOptions: ({ navigation }) => ({
      headerRight: (
        <FontAwesome5 name={ 'braille' } size={ 25 } color={ 'white' } style={{ marginRight: 20 }} onPress={() => navigation.openDrawer()}/>
      )
    })
  },
  Admin: { screen: GetAllCorrection }
})

const StackProfileNavigation = createStackNavigator({
  Profile: { screen: ProfileContainers, navigationOptions: { header: null } },
  Change: { screen: ChangePasswordContainers },
})

const StackEmployeeNavigation = createStackNavigator({
  Employee: { screen: EmployeeContainers, navigationOptions: { title: 'All Employee' } },
  Filter: { screen: FilterEmployeeContainers }
})


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
  },
  Employee: {
    screen: StackEmployeeNavigation,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <FontAwesome5 name={ 'briefcase' } color={ tintColor } />,
      title: 'Employee'
    }
  }
})

const SwitchNavigation = createSwitchNavigator({
  Prepare: { screen: PrepareApplication },
  Home: { screen: StackSigninNavigation },
  DashBoard: { screen: TabsNavigation }
}, { initialRouteName: 'Prepare' })

export default createAppContainer( SwitchNavigation );