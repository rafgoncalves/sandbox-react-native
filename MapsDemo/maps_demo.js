import React, { Component } from 'react';
import MapView from 'react-native-maps';

export default class Maps extends Component {
	static navigationOptions = {
		title: 'Google Maps'
	};

	render() {
		return (
			<MapView
				style={{ width: '100%', height: '100%' }}
				initialRegion={{
					latitude: 37.78825,
					longitude: -122.4324,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421
				}}
			/>
		);
	}
}
