import React, { Component, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Styles from '../styles';
import { Client, Message } from 'paho-mqtt';

// http://test.mosquitto.org/ws.html
// http://www.hivemq.com/demos/websocket-client/

export default function MQTTList(props) {
	function startMQTTClient() {
		mqtt_client.onConnectionLost = (responseObject) => {
			if (responseObject.errorCode !== 0) {
				console.log('onConnectionLost:' + responseObject.errorMessage);
			}
		};

		mqtt_client.onMessageArrived = (message) => {
			console.log('< ' + message.payloadString);

			setMQTTMessages([ ...mqtt_messages, { key: message.payloadString + ' QoS: ' + message.qos } ]);
		};

		mqtt_client.onMessageDelivered = (message) => console.log('> ' + message.payloadString);

		mqtt_client.connect({
			onSuccess: (onSuccess = () => {
				mqtt_client.subscribe('flatlist', { qos: 2 });

				interval_handle = setInterval(() => {
					if (mqtt_client.isConnected()) {
						message = new Message('Test message #' + mqtt_messages.length);
						message.destinationName = 'flatlist';
						mqtt_client.send(message);
					}
				}, 200);

				mqtt_client.onConnectionLost = () => clearTestMessageInterval();
			})
		});
	}

	function clearTestMessageInterval() {
		return interval_handle && clearInterval(interval_handle);
	}

	const [ mqtt_client ] = useState(
		new Client((host = 'broker.mqttdashboard.com'), (port = 8000), (clientId = 'reactNativeRafael'))
	);

	const [ mqtt_messages, setMQTTMessages ] = useState(new Array());

	useEffect(() => {
		startMQTTClient();

		return () => {
			clearTestMessageInterval();
			mqtt_client.disconnect();
		};
	});

	return (
		<View style={Styles.container}>
			<FlatList
				style={Styles.basiclist}
				data={mqtt_messages}
				renderItem={({ item }) => <Text style={Styles.welcome}>{item.key}</Text>}
			/>
		</View>
	);
}
