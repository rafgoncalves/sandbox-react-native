import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './home';
import LispDemo from './LispDemo/lisp_demo';
import MQTTList from './MqttList/mqtt_list';
import CustomForm from './CustomFormDemo/custom_form_demo';
import Maps from './MapsDemo/maps_demo';

const AppNavigator = createStackNavigator({
  Home: { screen: Home },
  LispDemo: { screen: LispDemo},
  MQTTList: {screen: MQTTList},
  CustomForm: {screen: CustomForm},
  Maps: {screen: Maps}
});

export default createAppContainer(AppNavigator);