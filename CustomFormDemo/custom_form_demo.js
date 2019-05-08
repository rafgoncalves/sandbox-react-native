import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Styles from '../styles';
import custom_form from './custom_form';
import DynamicForm from './dynamic_form';

export default class CustomForm extends Component {
	static navigationOptions = {
		title: 'Custom Form'
	};

	render() {
		return (
			<View style={Styles.container}>
				<Text style={Styles.welcome}>Hey look, there's a form!</Text>
				<DynamicForm spec={custom_form} />
			</View>
		);
	}
}
