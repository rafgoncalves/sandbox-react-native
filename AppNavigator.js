import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './home';
import LispDemo from './LispDemo/lisp_demo';
import MQTTList from './MqttList/mqtt_list';

const AppNavigator = createStackNavigator({
  Home: { screen: Home },
  LispDemo: { screen: LispDemo},
  MQTTList: {screen: MQTTList},
});

export default createAppContainer(AppNavigator);