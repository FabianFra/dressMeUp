import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import AnimatedCircle from './src/scripts/components/AnimatedCircle';
import GlobalStyle from "./src/scripts/js/GlobalStyle";
import DatabaseHandler from "./src/scripts/js/DatabaseHandler";

import CreateUserView from "./src/scripts/views/CreateUserView";

export default function App() {

    const StartScreen = ({navigation}) => {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>Dress me up!</Text>
                </View>
                <View>
                    <AnimatedCircle></AnimatedCircle>
                </View>
                <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => handleNavigation(navigation)}>
                    <Text style={GlobalStyle.commonText}>Start now!</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const handleNavigation = async (navigation) => {
        await DatabaseHandler.getData("userData").then(data => {
            if(data === null) {
                console.log("Navigate to create user profile")
                navigation.navigate('CreateUserView');
            } else {
                console.log("Navigate to HomeScreen")
                navigation.navigate('HomeScreen')
            }
        })
    }
    const HomeScreen = ({navigation}) => {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>Build me!</Text>
                </View>
            </View>
        )
    }

    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name={'StartScreen'} component={StartScreen}/>
                <Stack.Screen name={'HomeScreen'} component={HomeScreen}/>
                <Stack.Screen name={'CreateUserView'} component={CreateUserView}/>
            </Stack.Navigator>
        </NavigationContainer>
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
