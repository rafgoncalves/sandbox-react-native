import React, {Component, PureComponent} from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
import Styles from '../styles';
import { Formik, Field, FieldArray, getIn} from 'formik';
import miniMAL from 'minimal-lisp';
import MiniMALCore from '../miniMAL_core';
import custom_form from './custom_form';
import {get_initial_values, dict} from './form_utils';
import {get_component} from './form_components';


const m = miniMAL(global);
m.eval(MiniMALCore);


class RenderFieldTree extends PureComponent{

  renderFieldArray(fieldArray, values, name, props){
  
    return(
      <FieldArray
        name={name}
        key={name}
        render={ arrayHelpers => ( 
          <View style={{width: '100%',  alignItems: 'center'}}>
            <Text>{fieldArray.label}</Text>
          {
            (values && values.length > 0) ? (
              values.map((e, index) =>(
                <View key={index} style={Styles.terminal}>
                  <Button onPress={() => arrayHelpers.remove(index)} title="X" />
                  <RenderFieldTree
                    root={fieldArray}
                    namespace={name} 
                    index={index}
                    {...props}
                  />
                </View>
              ))) : (
                <Text>{fieldArray.empty}</Text>
              ) 
          }

          {
            (values && values.length >= fieldArray.max) ?
              null : <Button onPress={() => {arrayHelpers.push(dict(fieldArray.fields.map(f => [f.name, f.initial])))}} title="Insert!" /> 
          }
          </View>
        )}
      />
      )
  }

  _renderField(component, label, name, validate){
    return (
      <Field component={get_component(component)}
      label={label}
      name={name}
      key={name}
      validate={(value) => m.eval(['let', ['value', ['`', value]], JSON.parse(validate)])}
      />
    )
  }

  render(){
    const {root, namespace=null, index=null, ...props} = this.props;

    const renderFields = root.fields.map((f) => {
                
      const enable = m.eval(['let', ['values', props.values], JSON.parse(f.enable)]);
      const name = namespace ? `${namespace}.${index}.${f.name}`: f.name;
      
      if (enable){
        if(f.type === 'FieldArray'){   
          const values = getIn(props.values, name);
          return this.renderFieldArray(f, values, name, props);
          
        } else {
  
          return this._renderField(f.type, f.label, name, f.validate)
        }
      }
    });
  
    return renderFields;
  }

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
              {...props}
            />
          
          <Button onPress={props.handleSubmit} title="Submit" />
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
