import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AnimatedCircle from './src/scripts/components/AnimatedCircle';
import GlobalStyle from "./src/scripts/js/GlobalStyle";

export default function App() {
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
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2b3940',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black'
    },
    title: {
        color: '#f5f6f7',
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Roboto'
    }
});
