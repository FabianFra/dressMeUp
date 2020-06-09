import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import AnimatedCircle from "../components/AnimatedCircle";
import GlobalStyle from "./GlobalStyle";

export default function NavigationHandler() {
    const stackNavigator = createStackNavigator();

    const HomeScreen = () => {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>Dress me up!</Text>
                </View>
                <View>
                    <AnimatedCircle></AnimatedCircle>
                </View>
                <TouchableOpacity style={GlobalStyle.commonButton}>
                    <Text style={GlobalStyle.commonText}>Start now!</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

