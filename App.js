import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import AnimatedCircle from './src/scripts/components/AnimatedCircle';
import GlobalStyle from "./src/scripts/js/GlobalStyle";
import DatabaseHandler from "./src/scripts/js/DatabaseHandler";
import {navigationRef} from "./src/scripts/js/RootNavigation";

import CreateUserView from "./src/scripts/views/CreateUserView";
import SearchView from "./src/scripts/views/SearchView";
import SeasonTypeHandler from "./src/scripts/js/SeasonTypeHandler";
import FabscheAlgorithm from "./FabscheAlgorithmus/src/scripts/FabscheAlgorithm.js";
import User from "./FabscheAlgorithmus/src/scripts/User";
import LoggingTool from "./FabscheAlgorithmus/src/scripts/LoggingTool";


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
                <TouchableOpacity style={[GlobalStyle.commonButton, {width: "50%"}]} onPress={() => this.handleNavigation(navigation)}>
                    <Text style={GlobalStyle.commonText}>Los geht's!</Text>
                </TouchableOpacity>
            </View>
        )
    }

    HomeScreen = ({navigation}) => {
        return (
            <View style={{backgroundColor: '#2b3940', width: "100%", height: "100%"}}>
                <View style={{paddingTop: 30}}>
                    <Text style={GlobalStyle.commonTitle}>Hauptmenü</Text>
                </View>
                <View style={GlobalStyle.mainMenuContainer}>
                    <View style={{flex: 0.8, flexDirection: "column", justifyContent: "center",  marginHorizontal: 10}}>
                        <TouchableOpacity style={[GlobalStyle.mainMenuButton, GlobalStyle.commonShadow]} onPress={() => { navigation.navigate('SearchMenu') }}>
                            <Text style={GlobalStyle.commonText}>Ich suche</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={true} style={[GlobalStyle.mainMenuButton, GlobalStyle.commonShadow, GlobalStyle.disabled]}>
                            <Text style={GlobalStyle.commonText}>Mein Kleiderschrank</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={true} style={[GlobalStyle.mainMenuButton, GlobalStyle.commonShadow, GlobalStyle.disabled]}>
                            <Text style={GlobalStyle.commonText}>Einstellungen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {{flex: 0.1, flexDirection: "column", justifyContent: "flex-end"}}>
                    <TouchableOpacity style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", borderTopWidth: 0.2, borderTopColor: "white"}} onPress={() => this.resetDatabase(navigation)}>
                        <Text style={GlobalStyle.commonText}>Profil zurücksetzen</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    SearchMenu = ({navigation}) => {
        return (
            <View style={{backgroundColor: '#2b3940', width: "100%", height: "100%"}}>
                <View style={{paddingTop: 30}}>
                    <Text style={GlobalStyle.commonTitle}>Was suchst du?</Text>
                </View>
                <View style={GlobalStyle.mainMenuContainer}>
                    <View style={{flex: 0.8, flexDirection: "column", justifyContent: "center",  marginHorizontal: 10}}>
                        <TouchableOpacity style={[GlobalStyle.mainMenuButton, GlobalStyle.commonShadow, {flexDirection: "row", justifyContent: "center"}]} onPress={() => { global.searchFor = FabscheAlgorithm.SEARCH_OPTIONS.SHIRT; navigation.navigate('SearchView') }}>
                            <Text style={[GlobalStyle.commonText, {marginRight: 10}]}>T-Shirt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={true} style={[GlobalStyle.mainMenuButton, GlobalStyle.disabled, {flexDirection: "row", justifyContent: "center"}]}>
                            <Text style={[GlobalStyle.commonText, {marginRight: 10}]}>Jacke</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={true} style={[GlobalStyle.mainMenuButton, GlobalStyle.disabled, {flexDirection: "row", justifyContent: "center"}]}>
                            <Text style={[GlobalStyle.commonText, {marginRight: 10}]}>Hose</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={true} style={[GlobalStyle.mainMenuButton, GlobalStyle.disabled, {flexDirection: "row", justifyContent: "center"}]}>
                            <Text style={[GlobalStyle.commonText, {marginRight: 10}]}>Schuhe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={true} style={[GlobalStyle.mainMenuButton, GlobalStyle.disabled, {flexDirection: "row", justifyContent: "center"}]}>
                            <Text style={[GlobalStyle.commonText, {marginRight: 10}]}>Krawatte</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    CreateUserScreen = () => {
        return (
            <CreateUserView></CreateUserView>
        )
    }

    SearchView = ({navigation}) => {
        return (
            <SearchView onBack={() => navigation.navigate("HomeScreen")}></SearchView>
        )
    }

    handleNavigation = async (navigation) => {
        await DatabaseHandler.getDataObject("userData").then(data => {
            if(data === null) {
                LoggingTool.printDebug("Navigate to create user profile")
                navigation.navigate('CreateUserView');
            } else {
                LoggingTool.printDebug("Navigate to HomeScreen")
                this.setSeasonType(data);
                global.currentUser = new User(global.seasonType.id, data.skinColor, data.eyeColor, data.hairColor, data.desirableColors, data.undesirableColors);
                navigation.navigate('HomeScreen')
            }
        })
    }

    resetDatabase = async (navigation) => {
        return await DatabaseHandler.removeAppsKeys().then(() => {
            global.currentUser = undefined;
            navigation.navigate('StartScreen');
        });
    }

    /**
     * Setzt die globale Variable für den Jahreszeittyp des Benutzers
     * @param data --> userData (Object)
     */
    setSeasonType = (data) => {
        let seasonTypeObject = SeasonTypeHandler.getSeasonTypeObject(data.seasonType);

        if(typeof seasonTypeObject !== "undefined") {
            global.seasonType = seasonTypeObject;
        } else {
            LoggingTool.printError("Couldn't assign the global variable (seasonType) for the current user.");
        }
    }

    render = () => {
        let Stack = createStackNavigator();
        
        return (
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name={'StartScreen'} component={this.StartScreen}/>
                    <Stack.Screen name={'HomeScreen'} component={this.HomeScreen}/>
                    <Stack.Screen name={'SearchMenu'} component={this.SearchMenu}/>
                    <Stack.Screen name={'SearchView'} component={this.SearchView}/>
                    <Stack.Screen name={'CreateUserView'} component={this.CreateUserScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

}
