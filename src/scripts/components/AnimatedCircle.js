import {Animated, StyleSheet} from "react-native";
import React, {useState} from "react";
import MartianColorHandler from "../../../FabscheAlgorithmus/src/scripts/MartianColorHandler";

/**
 * Die Klasse beinhaltet den Quellcode für den animierten Kreis, welcher auf dem Startbildschirm zu sehen ist.
 * Es wird ein Element exportiert, welche im App.js benutzt wird.
 *
 * @see(App.js)
 * @returns {JSX.Element}
 * @constructor
 */
export default function AnimatedCircle() {
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
    const [colorHandler] = useState(new MartianColorHandler());

    const buildAnimationParams = () => {
        let colors = colorHandler.getAllColors(false);

        let animationParam = {
            inputRange: [],
            outputRange: []
        };

        let iterator = 1;

        for(let color of colors) {
            animationParam.inputRange.push(iterator);
            animationParam.outputRange.push(color.hex);
            iterator++;
        }

        return animationParam;
    }

    const interpolateColor = animatedValue.interpolate(buildAnimationParams())

    Animated.loop(
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 120,
                duration: 120000
            })
        ])
    ).start()

    const animatedStyle = {
        backgroundColor: interpolateColor
    }

    return (
        <Animated.View style={[styles.circle, animatedStyle]}></Animated.View>
    );
}

const styles = StyleSheet.create({
    circle: {
        width: 150,
        height: 150,
        borderRadius: 150/2,
        marginTop: 50,
        marginBottom: 50,
    },
});