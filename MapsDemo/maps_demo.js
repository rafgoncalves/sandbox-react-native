import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Styles from '../styles';

export default class Maps extends Component {
  static navigationOptions = {
    title: 'Google Maps',
  }
  
  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.welcome}>Oh no, you didn't code Google Maps yet!</Text>
      </View>
    );
  }
}
