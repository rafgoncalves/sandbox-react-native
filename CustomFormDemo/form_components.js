import React from 'react';
import {Text, Switch as RNSwitch, TextInput as RNTextInput} from 'react-native';
import Styles from '../styles';
import {fieldfy} from './form_utils';

function get_component(name){
  const components = {
      Switch: Switch,
    }

  return components[name];
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
  }
);

const TextInput = fieldfy((props) => {
    const { field: {name, value, error, touched, onBlur, onChange}, label, form} = props;

    return (
      <React.Fragment>
        <Text>{label}</Text>
        <RNTextInput
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
        />
      </React.Fragment>
    );
  }
);

export {get_component, Switch, TextInput};