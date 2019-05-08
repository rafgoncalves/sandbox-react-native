import { getIn } from 'formik';

function get_initial_values(custom_form) {
	const cf_initials = {};
	custom_form.fields.map((f) => {
		cf_initials[f.name] = f.initial;
	});

	return cf_initials;
}

function fieldfy(component) {
	return (props) => {
		const { field, form } = props;

		field.onChange = form.handleChange(field.name);
		field.onBlur = form.handleBlur(field.name);
		field.error = getIn(form.errors, field.name);
		field.touched = getIn(form.touched, field.name);
		field.value = getIn(form.values, field.name);

		return component(props);
	};
}

function dict(iter) {
	const r = {};

	for (let e of iter) r[e[0]] = e[1];

	return r;
}

export { get_initial_values, fieldfy, dict };
