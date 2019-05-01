import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import Styles from '../styles';
import { Formik, Field, FieldArray} from 'formik';
import miniMAL from 'minimal-lisp';
import MiniMALCore from '../miniMAL_core';
import custom_form from './custom_fom';
import {get_initial_values} from './form_utils';
import {get_component, TextInput} from './form_components';

const m = miniMAL(global);
m.eval(MiniMALCore);

const MyReactNativeForm = props => (
    <Formik 
      initialValues={get_initial_values(custom_form)}
      onSubmit={values => console.log(values)}
    >
      {({values, errors, touched, handleSubmit, ...rest}) => (
        <View  style={Styles.center}>
          {
            custom_form.fields.map((f) => {
              
              const enable = m.eval(['let', ['values', values], JSON.parse(f.enable)]);

              return (
              enable ?
                <Field component={get_component(f.type)}
                  validate={(value) => m.eval(['let', ['value', value], JSON.parse(f.validate)])}
                  label={f.label}
                  name={f.name}
                  key={f.key}
                />
              : null
            )})
          }
            <Field component={TextInput} name="SimpleTextInput" label="Simple Text Input"/>
          
          {/* <FieldArray
            name="friends"
            render={arrayHelpers => (
              (values.friends && values.friends.length > 0) ? (
                values.friends.map((friend, index) =>(
                  <View key={index}>
                    <Button onPress={} title="X" />
                    <Field component={TextInput} name={`friends.${index}`} />
                  </View>
                ))) : (
                  <Button onPress={handleSubmit} title="Insert!" />
                ) 
            )}

          /> */}
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
