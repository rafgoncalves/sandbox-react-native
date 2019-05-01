function get_initial_values(custom_form){
  const cf_initials = {};
  custom_form.fields.map((f) => {cf_initials[f.name] = f.initial});

  return cf_initials;
}

function fieldfy(component){

  return (props) => {
    const {field, form, values} = props;

    field.onChange = form.handleChange(field.name);
    field.onBlur = form.handleBlur(field.name);
    field.error = form.errors[field.name];
    field.touched = form.touched[field.name];
    field.value = form.values[field.name];

    return component(props);
  }
}

export {get_initial_values, fieldfy};