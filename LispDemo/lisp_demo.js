import React, {Component, useState} from 'react';
import {Text, View, Animated} from 'react-native';
import miniMAL from 'minimal-lisp';
import {cycle} from 'itertools';
import RenderSVG from './svg'
import RandomButton from './button'
import Styles from '../styles'

function LispDemoScreen(props){

  const _bindMiniMAL = () => {
    const m = miniMAL(global);
    
    m.eval(['def', 'foobar', ['fn', [], ['`', 'Hello From Lisp']]]);
    m.eval(['def', 'random', ['fn', [], ['.', 'Math', ['`', 'random']]]]);

    return m;
  }

  const buttonPress = () => {
    setRandomNumber(m.eval(['random']));
    setColor(colorGenerator.next().value)

    Animated.timing(                  
      rotation,            
      {
        toValue: stopRotations.next().value ,                  
        duration: 990 * randomNumber + 10,              
      }
    ).start(); 
  }

  const m = _bindMiniMAL();

  const [stopRotations] = useState(function* () {let r = 0; while(true) yield r += 45}())
  const [colorGenerator] = useState(cycle(['powderblue', 'skyblue', 'steelblue', 'orange', 'darkorange']));
  const [color, setColor] = useState(colorGenerator.next().value);
  const [randomNumber, setRandomNumber] = useState(m.eval(['random']));
  const [rotation] = useState(new Animated.Value(0));

  return (
    <View style={Styles.container}>
      <RenderSVG color={color} rotation={rotation}/>
      <Text style={Styles.welcome}>Welcome to React Native!</Text>
      <Text style={Styles.welcome}>{m.eval(['foobar'])}</Text>
      <RandomButton onPress={buttonPress} title={randomNumber}/>
      <Text style={Styles.instructions}>This number was calculated by miniMAL interpreter and that simple box is a SVG, GPU rendered. </Text>
      
    </View>
  )
}

export default class LispDemo extends Component {
  static navigationOptions = {
    title: 'Lisp Demo',
  }

  render() {
    return(
      <LispDemoScreen />
    )
  }
}
