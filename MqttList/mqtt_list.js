import React, { Component, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Styles from '../styles';
import { Client, Message } from 'paho-mqtt';

// http://test.mosquitto.org/ws.html
// http://www.hivemq.com/demos/websocket-client/

export default function MQTTList(props) {
	function clearTestMessageInterval() {
		return interval_handle && clearInterval(interval_handle);
	}

	// We need these to be global so we can pass them to PahoClient
	[ mqtt_messages, setMQTTMessages ] = useState(new Array());

	useEffect(() => {
		console.log('use effect start');
		const client = new Client((host = 'broker.mqttdashboard.com'), (port = 8000), (clientId = 'reactNativeRafael'));

		client.onConnectionLost = (responseObject) => {
			if (responseObject.errorCode !== 0) {
				console.log('onConnectionLost:' + responseObject.errorMessage);
			}
		};

		client.onMessageArrived = (message) => {
			console.log('R: ' + message.payloadString);

			setMQTTMessages([ ...mqtt_messages, { key: message.payloadString + ' QoS: ' + message.qos } ]);
		};

		client.onMessageDelivered = (message) => console.log('S: ' + message.payloadString);

		client.connect({
			onSuccess: (onSuccess = () => {
				client.subscribe('flatlist', { qos: 2 });

				let i = 0;

				interval_handle = setInterval(() => {
					if (client.isConnected()) {
						const message = new Message('Test message #' + i++);
						message.destinationName = 'flatlist';
						client.send(message);
					}
				}, 200);

				client.onConnectionLost = () => clearTestMessageInterval();
			})
		});

		return function() {
			console.log('use effect end');
			clearTestMessageInterval();
			client.disconnect();
		};
	}, []);

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
