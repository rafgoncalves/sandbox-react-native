import React, { PureComponent, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import Styles from '../styles';
import { Formik, Field, FieldArray, getIn } from 'formik';
import miniMAL from 'minimal-lisp';
import MiniMALCore from '../miniMAL_core';
import { get_initial_values, dict } from './form_utils';
import { get_component } from './form_components';

const m = miniMAL(global);
m.eval(MiniMALCore);

function RenderFieldTree(props) {
	const { root, namespace = null, index = null, set_enabled, ...rest } = props;

	const renderFieldArray = (fieldArray, values, name, set_enabled, props) => {
		return (
			<FieldArray
				name={name}
				key={name}
				render={(arrayHelpers) => (
					<View style={{ width: '100%', alignItems: 'center' }}>
						<Text>{fieldArray.label}</Text>
						{values && values.length > 0 ? (
							values.map((e, index) => (
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
							))
						) : (
							<Text>{fieldArray.empty}</Text>
						)}

						{values && values.length >= fieldArray.max ? null : (
							<Button
								onPress={() => {
									arrayHelpers.push(dict(fieldArray.fields.map((f) => [ f.name, f.initial ])));
								}}
								title="Insert!"
							/>
						)}
					</View>
				)}
			/>
		);
	};

	const renderField = (component, label, name, validate, props) => {
		return (
			<Field
				component={get_component(component)}
				label={label}
				name={name}
				key={name}
				validate={(value) => m.eval([ 'let', [ 'value', [ '`', value ] ], JSON.parse(validate) ])}
				{...props}
			/>
		);
	};

	return root.fields.map((f) => {
		const name = namespace ? `${namespace}.${index}.${f.name}` : f.name;
		const value = getIn(props.values, name);
		const enable = m.eval([ 'let', [ 'values', props.values ], JSON.parse(f.enable) ]);
		const value_exists_and_not_fieldarray = value !== undefined && typeof value !== 'object';

		set_enabled(name, enable && value_exists_and_not_fieldarray);

		if (enable) {
			return f.type === 'FieldArray'
				? renderFieldArray(f, value, name, set_enabled, rest)
				: renderField(f.type, f.label, name, f.validate, rest);
		}
	});
}

export default function DynamicForm(props) {
	const { spec } = props;

	const [ enabled, setEnabled ] = useState(new Set());

	const _set_enabled = (fieldname, flag) => {
		flag ? enabled.add(fieldname) : enabled.delete(fieldname);
		setEnabled(enabled);
	};

	const _handle_submit = (values) => {
		console.log(values);
		console.log(enabled);
	};

	return (
		<Formik
			initialValues={{ ...get_initial_values(spec) }}
			onSubmit={_handle_submit}
			render={(props) => (
				<ScrollView style={{ width: '100%' }} contentContainerStyle={Styles.center}>
					<RenderFieldTree root={spec} set_enabled={_set_enabled} {...props} />

					<Button onPress={props.handleSubmit} title="Submit" />
				</ScrollView>
			)}
		/>
	);
}
