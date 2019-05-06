import React, {PureComponent} from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
import Styles from '../styles';
import { Formik, Field, FieldArray, getIn} from 'formik';
import miniMAL from 'minimal-lisp';
import MiniMALCore from '../miniMAL_core';
import {get_initial_values, dict} from './form_utils';
import {get_component} from './form_components';


const m = miniMAL(global);
m.eval(MiniMALCore);


class RenderFieldTree extends PureComponent{

  renderFieldArray(fieldArray, values, name, set_enabled, props){
  
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
                    set_enabled={set_enabled}
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

  _renderField(component, label, name, validate, props){
    return (
      <Field component={get_component(component)}
      label={label}
      name={name}
      key={name}
      validate={(value) => m.eval(['let', ['value', ['`', value]], JSON.parse(validate)])}
      {...props}
      />
    )
  }

  render(){
    const {root, namespace=null, index=null, set_enabled, ...props} = this.props;

    return root.fields.map((f) => {
    
      const name = namespace ? `${namespace}.${index}.${f.name}`: f.name;
      const values = getIn(props.values, name);
      const enable = m.eval(['let', ['values', props.values], JSON.parse(f.enable)]);
      const value_exists_and_not_fieldarray = values !== undefined && typeof(values) !== 'object';
      
      set_enabled(name, enable && value_exists_and_not_fieldarray);

      if (enable){
        return (f.type === 'FieldArray') ? 
          this.renderFieldArray(f, values, name, set_enabled, props) :
          this._renderField(f.type, f.label, name, f.validate, props)
        }
      }
    )
  }

}


export default class DynamicForm extends PureComponent {
  constructor(props){
    super(props);
    this.enabled = new Set();
    this.spec = props.spec
  }

  _set_enabled = (fieldname, flag) => {
    flag ? this.enabled.add(fieldname) : this.enabled.delete(fieldname)
  }

  _handle_submit = (values) => {
    console.log(values);
    console.log(this.enabled);
  }
  
  render = () => {
    return (
      <Formik 
        initialValues={{...get_initial_values(this.spec)}} 
        onSubmit={this._handle_submit}
        
        render={(props) => (
          <ScrollView style={{width: '100%'}} contentContainerStyle={Styles.center}>
              <RenderFieldTree
                root={this.spec}
                set_enabled={this._set_enabled}
                {...props}
              />
            
            <Button onPress={props.handleSubmit} title="Submit" />
          </ScrollView>
        )}
      />
    );
  }
}