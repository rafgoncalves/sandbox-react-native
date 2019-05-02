import React, {Component} from 'react';
import {View, Text, Button, Fragment} from 'react-native';
import Styles from '../styles';
import { Formik, Field, FieldArray, getIn} from 'formik';
import miniMAL from 'minimal-lisp';
import MiniMALCore from '../miniMAL_core';
import custom_form from './custom_fom';
import {get_initial_values} from './form_utils';
import {get_component, TextInput, Switch} from './form_components';


const m = miniMAL(global);
m.eval(MiniMALCore);

const RenderFieldTree = ({root, namespace=null, index=0, props}) =>{
  const renderFields = root.fields.map((f) => {
              
    const enable = m.eval(['let', ['values', props.values], JSON.parse(f.enable)]);
      
    if (enable){
      if(f.type === 'FieldArray'){   
        const values = getIn(props.values, f.name);

        return (
          <FieldArray
            name={f.name}
            key={f.key}
            render={ arrayHelpers => ( 
              <View>
              {
              (values && values.length > 0) ? (
                values.map((e, index) =>(
                  <View key={index}>
                    <Button onPress={() => arrayHelpers.remove(index)} title="X" />
                    {
                        f.fields.map((c) => (
                        <Field component={get_component(c.type)}
                          validate={(value) => m.eval(['let', ['value', value], JSON.parse(c.validate)])}
                          label={c.label}
                          name={`${f.name}.${index}.${c.name}`}
                          key={`${f.name}.${index}.${f.key}`}
                        />
                      ))
                    }
                  </View>
                ))) : (
                  <Text>No Friends yet</Text>
                ) 
              }
                <Button onPress={() => arrayHelpers.push('')}title="Insert!" />
              </View>
            )}
          />
        )
      } else {
        return (
          <Field component={get_component(f.type)}
            validate={(value) => m.eval(['let', ['value', value], JSON.parse(f.validate)])}
            label={f.label}
            name={f.name}
            key={f.key}
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
          
          {/* <FieldArray
            name="friends"
            render={arrayHelpers => ( 
              <View>
              {
              (props.values.friends && props.values.friends.length > 0) ? (
                props.values.friends.map((friend, index) =>(
                  <View key={index}>
                    <Button onPress={() => arrayHelpers.remove(index)} title="X" />
                    <Field component={TextInput} name={`friends.${index}.text`} />
                    <Field component={Switch} name={`friends.${index}.switch`}/>
                  </View>
                ))) : (
                  <Text>No Friends yet</Text>
                ) 
              }
                <Button onPress={() => arrayHelpers.push('')}title="Insert!" />
              </View>
            )}
          /> */}
          
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
