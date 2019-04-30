import React, {Component, PureComponent} from 'react';
import {View, Text, Button, TextInput, Switch as RNSwitch} from 'react-native';
import Styles from '../styles';
import { Formik, Field } from 'formik';
import miniMAL from 'minimal-lisp';

const m = miniMAL(global);

const core = ["do",

["def", "new", ["fn", ["a", "&", "b"],
  [".", "Reflect", ["`", "construct"], "a", "b"]]],
["def", "del", ["fn", ["a", "b"],
  [".", "Reflect", ["`", "deleteProperty"], "a", "b"]]],
["def", "map", ["fn", ["a", "b"],
  [".", "b", ["`", "map"], ["fn", ["x"], ["a", "x"]]]]],
["def", "list", ["fn", ["&", "a"], "a"]],
["def", ">=", ["fn", ["a", "b"],
  ["if", ["<", "a", "b"], false, true]]],
["def", ">", ["fn", ["a", "b"],
  ["if", [">=", "a", "b"],
    ["if", ["=", "a", "b"], false, true],
    false]]],
["def", "<=", ["fn", ["a", "b"],
  ["if", [">", "a", "b"], false, true]]],

["def", "classOf", ["fn", ["a"],
  [".", [".-", [".-", "Object", ["`", "prototype"]], ["`", "toString"]],
        ["`", "call"], "a"]]],

["def", "not", ["fn", ["a"], ["if", "a", false, true]]],

["def", "null?", ["fn", ["a"], ["=", null, "a"]]],
["def", "true?", ["fn", ["a"], ["=", true, "a"]]],
["def", "false?", ["fn", ["a"], ["=", false, "a"]]],
["def", "string?", ["fn", ["a"],
  ["if", ["=", "a", null],
    false,
    ["=", ["`", "String"],
          [".-", [".-", "a", ["`", "constructor"]],
                 ["`", "name"]]]]]],

["def", "pr-str", ["fn", ["&", "a"],
  [".", ["map", [".-", "JSON", ["`", "stringify"]], "a"],
    ["`", "join"], ["`", " "]]]],
["def", "str", ["fn", ["&", "a"],
  [".", ["map", ["fn", ["x"],
                  ["if", ["string?", "x"],
                    "x",
                    [".", "JSON", ["`", "stringify"], "x"]]],
          "a"],
    ["`", "join"], ["`", ""]]]],
["def", "prn", ["fn", ["&", "a"],
  ["do", [".", "console", ["`", "log"],
           [".", ["map", [".-", "JSON", ["`", "stringify"]], "a"],
             ["`", "join"], ["`", " "]]],
    null]]],
["def", "println", ["fn", ["&", "a"],
  ["do", [".", "console", ["`", "log"],
           [".", ["map", ["fn", ["x"],
                           ["if", ["string?", "x"],
                             "x",
                             [".", "JSON", ["`", "stringify"], "x"]]],
                   "a"],
             ["`", "join"], ["`", " "]]],
    null]]],

["def", "list?", ["fn", ["a"],
  [".", "Array", ["`", "isArray"], "a"]]],
["def", "contains?", ["fn", ["a", "b"],
  [".", "a", ["`", "hasOwnProperty"], "b"]]],
["def", "get", ["fn", ["a", "b"],
    ["if", ["contains?", "a", "b"], [".-", "a", "b"], null]]],
["def", "set", ["fn", ["a", "b", "c"],
  ["do", [".-", "a", "b", "c"], "a"]]],
["def", "keys", ["fn", ["a"],
  [".", "Object", ["`", "keys"], "a"]]],
["def", "vals", ["fn", ["a"],
  [".", "Object", ["`", "values"], "a"]]],

["def", "cons", ["fn", ["a", "b"],
  [".", ["`", []],
        ["`", "concat"], ["list", "a"], "b"]]],
["def", "concat", ["fn", ["&", "a"],
  [".", [".-", ["list"], ["`", "concat"]],
        ["`", "apply"], ["list"], "a"]]],
["def", "nth", "get"],
["def", "first", ["fn", ["a"],
  ["if", [">", [".-", "a", ["`", "length"]], 0],
    ["nth", "a", 0],
    null]]],
["def", "last", ["fn", ["a"],
  ["nth", "a", ["-", [".-", "a", ["`", "length"]], 1]]]],
["def", "count", ["fn", ["a"],
  [".-", "a", ["`", "length"]]]],
["def", "empty?", ["fn", ["a"],
  ["if", ["list?", "a"],
    ["=", 0, [".-", "a", ["`", "length"]]],
    ["=", "a", null]]]],
["def", "slice", ["fn", ["a", "b", "&", "end"],
  [".", "a", ["`", "slice"], "b",
    ["if", [">", [".-", "end", ["`", "length"]], 0],
      ["get", "end", 0],
      [".-", "a", ["`", "length"]]]]]],
["def", "rest", ["fn", ["a"], ["slice", "a", 1]]],

["def", "apply", ["fn", ["f", "&", "b"],
  [".", "f", ["`", "apply"], "f",
    ["concat", ["slice", "b", 0, -1], ["last", "b"]]]]],

["def", "and", ["~", ["fn", ["&", "xs"],
  ["if", ["empty?", "xs"],
    true,
    ["if", ["=", 1, [".-", "xs", ["`", "length"]]],
      ["first", "xs"],
      ["list", ["`", "let"], ["list", ["`", "__and"], ["first", "xs"]],
        ["list", ["`", "if"], ["`", "__and"],
          ["concat", ["`", ["and"]], ["rest", "xs"]],
          ["`", "__and"]]]]]]]],

["def", "or", ["~", ["fn", ["&", "xs"],
  ["if", ["empty?", "xs"],
    null,
    ["if", ["=", 1, [".-", "xs", ["`", "length"]]],
      ["first", "xs"],
      ["list", ["`", "let"], ["list", ["`", "__or"], ["first", "xs"]],
        ["list", ["`", "if"], ["`", "__or"],
          ["`", "__or"],
          ["concat", ["`", ["or"]], ["rest", "xs"]]]]]]]]],

null
]

m.eval(core);

const custom_form = {
  fields: [
      {
        type: 'Switch',
        name: 'termsAndConditionsAccepted',
        label: 'Accept terms and conditions',
        validate: '["if", ["=", "value", false], ["`", "This must be true"]]',
        key: 12123,
        initial: true,
        enable: true,
      },

      {
        type: 'Switch',
        name: 'bogus',
        label: 'Test!',
        validate: '["if", ["=", "value", true], ["`", "This must be false"]]',
        key: 34245,
        initial: false,
        enable: true,
      },   

      {
        type: 'Switch',
        name: 'bogus2',
        label: 'Third time is a charm',
        validate: '["if", ["=", "value", false], ["`", "This must be true"]]',
        key: 3424,
        initial: true,
        enable: '["let", ["target", ["get", "values", ["`", "bogus"]]], "target"]',
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
