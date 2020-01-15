import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SigninContainers, ForgotContainers } from './src/containers'

const StackSigninNavigation = createStackNavigator({
  Signin: { screen: SigninContainers, navigationOptions: { header: null } },
  Forgot: { screen: ForgotContainers, navigationOptions: { title: 'Forgot Password' } }
}, { initialRouteName: 'Signin' })

const SwitchNavigation = createSwitchNavigator({
  Signin: { screen: StackSigninNavigation }
})

export default createAppContainer( SwitchNavigation );