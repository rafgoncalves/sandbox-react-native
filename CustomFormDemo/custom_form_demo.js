import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import Styles from '../styles';
import { Formik, Field, FieldArray, getIn} from 'formik';
import miniMAL from 'minimal-lisp';
import MiniMALCore from '../miniMAL_core';
import custom_form from './custom_fom';
import {get_initial_values, dict} from './form_utils';
import {get_component} from './form_components';


const m = miniMAL(global);
m.eval(MiniMALCore);



const RenderFieldTree = ({root, namespace=null, index=0, props}) =>{
  const renderFields = root.fields.map((f) => {
              
    const enable = m.eval(['let', ['values', props.values], JSON.parse(f.enable)]);
    const name = namespace ? `${namespace}.${index}.${f.name}`: f.name;
    const key = namespace ? `${namespace}.${index}.${f.key}` : f.key;

    console.log(name);

    if (enable){
      if(f.type === 'FieldArray'){   
        const values = getIn(props.values, name);

        const initial_group = {}
        for(c of f.fields)
          initial_group[c.name] = c.initial;

        return (
          <FieldArray
            name={name}
            key={key}
            render={ arrayHelpers => ( 
              <View>
                <Text>{f.label}</Text>
              {
              (values && values.length > 0) ? (
                values.map((e, index) =>(
                  <View key={index} style={Styles.terminal}>
                    <Button onPress={() => arrayHelpers.remove(index)} title="X" />
                    <RenderFieldTree
                      root={f}
                      namespace={name} 
                      props={props}
                      index={index}
                    />
                  </View>
                ))) : (
                  <Text>{f.empty}</Text>
                ) 
              }
                <Button onPress={() => {arrayHelpers.push(dict(f.fields.map(f => [f.name, f.initial])))}} title="Insert!" />
              </View>
            )}
          />
        )
      } else {
        
        return (
          <Field component={get_component(f.type)}
            validate={(value) => m.eval(['let', ['value', value], JSON.parse(f.validate)])}
            label={f.label}
            name={name}
            key={key}
          />
        )
      }
    }
  });

  return renderFields;
}

const MyReactNativeForm = (props) => (
    <Formik 
      initialValues={{...get_initial_values(custom_form), }}
      onSubmit={values => console.log(values)}
      
      render={(props) => (
        <View style={Styles.center}>
            <RenderFieldTree
              root={custom_form}
              props={props}
            />
          
          <Button onPress={props.handleSubmit} title="Submit" />
        </View>
      )}
    />
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
