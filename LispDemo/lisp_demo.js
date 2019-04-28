import React, {Component} from 'react';
import {Text, View, Animated} from 'react-native';
import miniMAL from 'minimal-lisp';
import {cycle} from 'itertools';
import RenderSVG from './svg'
import RandomButton from './button'
import Styles from '../styles'

export default class LispDemo extends Component {
  static navigationOptions = {
    title: 'Lisp Demo',
  }

  constructor(props) {
    super(props);

     _setupInitialState = () => {
      this.state = {
        color: this._colorGenerator.next().value,
        randomNumber: this.m.eval(['random']),
        rotation: new Animated.Value(0)
      };
    }
  
     _bindMiniMAL = () => {
      const m = miniMAL(global);
      
      m.eval(['def', 'foobar', ['fn', [], ['`', 'Hello From Lisp']]]);
      m.eval(['def', 'random', ['fn', [], ['.', 'Math', ['`', 'random']]]]);
  
      this.m = m;
    }
    
    this._colorGenerator = cycle(['powderblue', 'skyblue', 'steelblue', 'orange', 'darkorange']);
    this._stopRotations = function* () {let r = 0; while(true) yield r += 45}();

    _bindMiniMAL();
    _setupInitialState();
  }



  buttonPress() {

    const randomNumber = this.m.eval(['random']);

    this.setState((prevState) => { return {
      ...prevState, 
      randomNumber,
      color: this._colorGenerator.next().value
    }});

    Animated.timing(                  
      this.state.rotation,            
      {
        toValue: this._stopRotations.next().value ,                  
        duration: 990 * randomNumber + 10,              
      }
    ).start(); 
  }

  render() {
    return (
      <View style={Styles.container}>
        <RenderSVG color={this.state.color} rotation={this.state.rotation}/>
        <Text style={Styles.welcome}>Welcome to React Native!</Text>
        <Text style={Styles.welcome}>{this.m.eval(['foobar'])}</Text>
        <RandomButton onPress={() => this.buttonPress()} title={this.state.randomNumber}/>
        <Text style={Styles.instructions}>This number was calculated by miniMAL interpreter and that simple box is a SVG, GPU rendered. </Text>
        
      </View>
    );
  }
}
