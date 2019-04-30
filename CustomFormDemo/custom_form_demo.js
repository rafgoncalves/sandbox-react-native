import React, {Component, PureComponent} from 'react';
import {View, Text, Button, TextInput, Switch as RNSwitch} from 'react-native';
import Styles from '../styles';
import { Formik } from 'formik';
import { withFormikControl } from 'react-native-formik';

// TODO: https://codeburst.io/react-native-and-forms-redeux-part-1-9716f11b7ace

const Switch  = withFormikControl(class extends React.PureComponent {
    render() {
      const { error, value, setFieldValue, label } = this.props;

      return (
        <React.Fragment>
          <RNSwitch
            value={value}
            ios_backgroundColor={error ? "red" : "transparent"}
            onValueChange={setFieldValue}
          />
          <Text>{label}</Text>
        </React.Fragment>
      );
    }
  }
);

const MyReactNativeForm = props => (
  <Formik
    initialValues={{ email: '' }}
    onSubmit={values => console.log(values)}
  >
    {props => (
      <View>
        <TextInput
          onChangeText={props.handleChange('email')}
          onBlur={props.handleBlur('email')}
          value={props.values.email}
        />

        <Switch label="Accept terms and conditions" name="termsAndConditionsAccepted" />

        <Button onPress={props.handleSubmit} title="Submit" />
      </View>
    )}
  </Formik>
);

export default class CustomForm extends Component {
  static navigationOptions = {
    title: 'Custom Form',
  }
  
  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.welcome}>Hey look, there's a form!</Text>
        <MyReactNativeForm
        />
      </View>
    );
  }
}
