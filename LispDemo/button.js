import React from 'react';
import {View, Button} from 'react-native';

export default function RandomButton(props) {
    return (
        <View>
        <Button
            onPress={() => props.onPress()}
            title={props.title.toString()}
        />
        </View>
    )
}
