import React, { Component, useState } from 'react';
import { Text, View, Animated } from 'react-native';
import miniMAL from 'minimal-lisp';
import { cycle } from 'itertools';
import RenderSVG from './svg';
import RandomButton from './button';
import Styles from '../styles';

function LispDemoScreen(props) {
	const bindMiniMAL = () => {
		const m = miniMAL(global);

		m.eval([ 'def', 'foobar', [ 'fn', [], [ '`', 'Hello From Lisp' ] ] ]);
		m.eval([ 'def', 'random', [ 'fn', [], [ '.', 'Math', [ '`', 'random' ] ] ] ]);

		return m;
	};

	const buttonPress = () => {
		setRandomNumber(m.eval([ 'random' ]));
		setColor(colorGenerator.next().value);

		Animated.timing(rotation, {
			toValue: stopRotations.next().value,
			duration: 990 * randomNumber + 10
		}).start();
	};

	const m = bindMiniMAL();

	const { colors, rotation_step } = props;
	const [ stopRotations ] = useState(
		(function*() {
			let r = 0;
			while (true) yield (r += rotation_step);
		})()
	);
	const [ colorGenerator ] = useState(cycle(colors));
	const [ color, setColor ] = useState();
	const [ randomNumber, setRandomNumber ] = useState(m.eval([ 'random' ]));
	const [ rotation ] = useState(new Animated.Value(0));

	// Calling useState with the iterator.next() caused it to be evaluated
	color ? null : setColor(colorGenerator.next().value);

	return (
		<View style={Styles.container}>
			<RenderSVG color={color} rotation={rotation} />
			<Text style={Styles.welcome}>Welcome to React Native!</Text>
			<Text style={Styles.welcome}>{m.eval([ 'foobar' ])}</Text>
			<RandomButton onPress={buttonPress} title={randomNumber} />
			<Text style={Styles.instructions}>
				This number was calculated by miniMAL interpreter and that simple box is a SVG, GPU rendered.{' '}
			</Text>
		</View>
	);
}

export default function LispDemo() {
	return (
		<LispDemoScreen colors={[ 'powderblue', 'skyblue', 'steelblue', 'orange', 'darkorange' ]} rotation_step={45} />
	);
}
