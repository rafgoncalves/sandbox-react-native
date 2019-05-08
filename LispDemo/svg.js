import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

class RenderSvg extends Component {
	render() {
		return (
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					height: '20%'
				}}
			>
				<Svg height="100" width="100">
					<Rect
						x="15"
						y="15"
						width="70"
						height="70"
						rotation={this.props.rotation}
						originX="50"
						originY="50"
						strokeWidth="2"
						fill={this.props.color}
					/>
				</Svg>
			</View>
		);
	}
}

const AnimatedRenderSVG = Animated.createAnimatedComponent(RenderSvg);

export default AnimatedRenderSVG;
