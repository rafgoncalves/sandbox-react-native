import React, {Component} from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
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

    if (enable){
      if(f.type === 'FieldArray'){   
        const values = getIn(props.values, name);

        const initial_group = {}
        for(let c of f.fields)
          initial_group[c.name] = c.initial;

        return (
          <FieldArray
            name={name}
            key={name}
            render={ arrayHelpers => ( 
              <View style={{width: '100%',  alignItems: 'center'}}>
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

              {
                (values && values.length >= f.max) ?
                  null : <Button onPress={() => {arrayHelpers.push(dict(f.fields.map(f => [f.name, f.initial])))}} title="Insert!" /> 
              }
              </View>
            )}
          />
        )
      } else {
        
        return (
          <Field component={get_component(f.type)}
          label={f.label}
          name={name}
          key={name}
          validate={(value) => m.eval(['let', ['value', ['`', value]], JSON.parse(f.validate)])}
          />
        )
      }
    }
  });

  return renderFields;
}

const MyReactNativeForm = (props) => {
  return (
    <Formik 
      initialValues={{...get_initial_values(custom_form), }}
      onSubmit={values => console.log(values)}
      
      render={(props) => (
        <ScrollView style={{width: '100%'}} contentContainerStyle={Styles.center}>
            <RenderFieldTree
              root={custom_form}
              props={props}
            />
          
          <Button onPress={(...args) => {
                                          props.handleSubmit(...args); 
                                          console.log(props.errors)}}
          title="Submit" />
        </ScrollView>
      )}
    />
  );
}
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
