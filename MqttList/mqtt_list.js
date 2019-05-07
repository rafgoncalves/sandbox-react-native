import React, {Component} from 'react';
import { View, Text, FlatList} from 'react-native';
import Styles from '../styles';
import {Client, Message} from 'paho-mqtt'

// http://test.mosquitto.org/ws.html
// http://www.hivemq.com/demos/websocket-client/

export default class MQTTList extends Component {
  static navigationOptions = {
    title: 'MQTT FlatList',
  }

  constructor(props){
    super(props);

    this.mqtt_client  = new Client(
      host='broker.mqttdashboard.com',
      port=8000, 
      clientId="reactNativeRafael"
    ),

    this.mqtt_subscription_topic = 'flatlist';

    this.state = {
      mqtt_messages: new Array(),
    }
  }

  _startMQTTClient() {
    this.mqtt_client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
    };

    this.mqtt_client.onMessageArrived = (message) => {
      console.log("< " + message.payloadString);

      this.setState((prevState) => {
        return {
          ...prevState,
          mqtt_messages: [
            ...prevState.mqtt_messages,
            { key: message.payloadString + " QoS: " + message.qos }
          ]
        }
      })
    };

    this.mqtt_client.onMessageDelivered = (message) => console.log("> " + message.payloadString);
 
    this.mqtt_client.connect({
      onSuccess: onSuccess = () => {
        this.mqtt_client.subscribe("flatlist", {qos: 2});
  
        message = new Message("Hello from " + this.mqtt_client.clientId);
        message.destinationName = this.mqtt_subscription_topic;
        this.mqtt_client.send(message);

        let i = 0;

        this.interval_handle = setInterval(() => {
          if(this.mqtt_client.isConnected()){
            message = new Message("Test message #" + i++);
            message.destinationName = this.mqtt_subscription_topic;
            this.mqtt_client.send(message);
          }
        }, 200);

        this.mqtt_client.onConnectionLost = () => this._clearTestMessageInterval();
      }

    });

  }

  _clearTestMessageInterval(){
    return this.interval_handle && clearInterval(this.interval_handle);
  }

  componentDidMount(){
    this._startMQTTClient();
  }

  componentWillUnmount(){
    this._clearTestMessageInterval();
    this.mqtt_client.disconnect();
  }

  render() {
    return (
        <View style={Styles.container}>
            <FlatList style={Styles.basiclist}
                data={this.state.mqtt_messages}
                renderItem={
                    ({item}) => <Text style={Styles.welcome}>{item.key}</Text>
                }
            />
        </View>
    );
  }
}
