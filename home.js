import React, { Component } from 'react';
import { Button, View } from 'react-native';
import Styles from './styles';

export default class Home extends Component {
	static navigationOptions = {
		title: 'Home'
	};

	render() {
		return (
			<View style={Styles.container}>
				<Button title="Lisp Demo" onPress={() => this.props.navigation.navigate('LispDemo')} />
				<Button title="MQTT FlatList" onPress={() => this.props.navigation.navigate('MQTTList')} />
				<Button title="Custom Form" onPress={() => this.props.navigation.navigate('CustomForm')} />
				<Button title="Maps" onPress={() => this.props.navigation.navigate('Maps')} />
			</View>
		);
	}
}
