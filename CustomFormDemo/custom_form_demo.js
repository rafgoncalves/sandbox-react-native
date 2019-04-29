import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Styles from '../styles';

export default class CustomForm extends Component {
  static navigationOptions = {
    title: 'Custom Form',
  }
  
  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.welcome}>Oh no, you didn't code Custom Form yet!</Text>
      </View>
    );
  }
}
