import React, {Component, PureComponent} from 'react';
import {View, Text, Button, TextInput, Switch as RNSwitch} from 'react-native';
import Styles from '../styles';
import { Formik, Field } from 'formik';
import miniMAL from 'minimal-lisp';

const m = miniMAL(global);

function fieldfy(component){

  return (props) => {
    const {field, form} = props;

    field.onChange = form.handleChange(field.name);
    field.onBlur = form.handleBlur(field.name);
    field.error = form.errors[field.name];
    field.touched = form.touched[field.name];

    return component(props);
  }
}

const Switch = fieldfy((props) => {
  const { field: {value, error, onBlur, onChange}, label} = props;

  return (
    <React.Fragment>
      <RNSwitch
        value={value}
        onValueChange={(...params) => {onBlur(...params); onChange(...params);}}
        ios_backgroundColor={error ? 'red' : 'trasparent'}
      />
      <Text>{label}</Text>
    </React.Fragment>
  );
});

const MyReactNativeForm = props => (
  <Formik
    initialValues={{
      email: '', 
      termsAndConditionsAccepted: true,
    }}
    onSubmit={values => console.log(values)}
  >
    {({errors, touched}) => (
      <View>
        <Field component={Switch}
          validate={(value) => m.eval(

              ['if', ['=', value, false], 
                ['`', 'This must be true']]
            
          )}

          label="Accept terms and conditions" 
          name="termsAndConditionsAccepted" 
        />

        {touched.termsAndConditionsAccepted && errors.termsAndConditionsAccepted ? <Text>{errors.termsAndConditionsAccepted}</Text> : null}

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
        <MyReactNativeForm />
      </View>
    );
  }
}
