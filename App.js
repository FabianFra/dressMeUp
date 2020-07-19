import React, {Component} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AnimatedCircle from './src/scripts/components/AnimatedCircle';
import GlobalStyle from "./src/scripts/js/GlobalStyle";
import DatabaseHandler from "./src/scripts/js/DatabaseHandler";
import {navigationRef} from "./src/scripts/js/RootNavigation";

import CreateUserView from "./src/scripts/views/CreateUserView";

export default class App extends Component{

    StartScreen = ({navigation}) => {
        return (
            <View style={GlobalStyle.commonContainer}>
                <View>
                    <Text style={GlobalStyle.commonTitle}>Dress me up!</Text>
                </View>
                <View>
                    <AnimatedCircle></AnimatedCircle>
                </View>
                <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => this.handleNavigation(navigation)}>
                    <Text style={GlobalStyle.commonText}>Start now!</Text>
                </TouchableOpacity>
            </View>
        )
    }

    HomeScreen = ({navigation}) => {
        return (
            <View style={GlobalStyle.commonContainer}>
                <View>
                    <Text style={GlobalStyle.commonTitle}>Home Screen!</Text>
                </View>
            </View>
        )
    }

    CreateUserScreen = () => {
        return (
            <CreateUserView></CreateUserView>
        )
    }

    handleNavigation = async (navigation) => {
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

    render = () => {
        let Stack = createStackNavigator();

        return (
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name={'StartScreen'} component={this.StartScreen}/>
                    <Stack.Screen name={'HomeScreen'} component={this.HomeScreen}/>
                    <Stack.Screen name={'CreateUserView'} component={this.CreateUserScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

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
