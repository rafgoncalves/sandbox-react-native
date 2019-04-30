import React, {Component, PureComponent} from 'react';
import {View, Text, Button, TextInput, Switch as RNSwitch} from 'react-native';
import Styles from '../styles';
import { Formik, Field } from 'formik';
import miniMAL from 'minimal-lisp';

const m = miniMAL(global);

const custom_form = {
  fields: [
      {
        type: 'Switch',
        name: 'termsAndConditionsAccepted',
        label: 'Accept terms and conditions',
        validate: '["if", ["=", "value", false], ["`", "This must be true"]]',
        key: 12123,
        initial: true,
      },

      {
        type: 'Switch',
        name: 'bogus',
        label: 'Something entirely bogus',
        validate: '["if", ["=", "value", true], ["`", "This must be false"]]',
        key: 34245,
        initial: false,
      },   

      {
        type: 'Switch',
        name: 'bogus2',
        label: 'Third time is a charm',
        validate: '["if", ["=", "value", false], ["`", "This must be true"]]',
        key: 3424,
        initial: false,
      },   
    ]
}

function get_initial_values(custom_form){
  const cf_initials = {};
  custom_form.fields.map((f) => {cf_initials[f.name] = f.initial});

  return cf_initials;
}

function get_component(name){
  const components = {
    Switch: Switch,
  }

  return components[name];
}

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
  const { field: {name, value, error, touched, onBlur, onChange}, label} = props;

  return (
    <React.Fragment>
      <RNSwitch
        value={value}
        onValueChange={(...params) => {onBlur(...params); onChange(...params);}}
        // ios_backgroundColor={error ? 'red' : 'trasparent'}
      />
      {error && touched ? <Text style={Styles.error_msg}>{error}</Text> : null}
      <Text>{label}</Text>
    </React.Fragment>
  );
});

const MyReactNativeForm = props => (
    <Formik 
      initialValues={get_initial_values(custom_form)}
      onSubmit={values => console.log(values)}
    >
      {({errors, touched, handleSubmit}) => (
        <View  style={Styles.center}>
          {
            custom_form.fields.map((f) => (
              <Field component={get_component(f.type)}
                validate={(value) => m.eval(['let', ['value', value], JSON.parse(f.validate)])}
                label={f.label}
                name={f.name}
                key={f.key}
            />
            ))
          }
          <Button onPress={handleSubmit} title="Submit" />
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
