import React, {useState, Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal} from "react-native";
import { useNavigation } from '@react-navigation/native';

import GlobalStyle from "../js/GlobalStyle";
import QuestionHandler from "../components/QuestionHandler";
import DatabaseHandler from "../js/DatabaseHandler";

import * as RootNavigation from "../js/RootNavigation"
import {BackHandler} from "react-native-web";

import SeasonTypeAlgorithm from "../js/SeasonTypeAlgorithm";

export default class CreateUserView extends Component {
    constructor(props) {
        super(props);
        this.initializeState();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress)
    }

    initializeState = () => {
        this.state = {
            showQuestions: false,
            view: 'HomeScreen'
        }
    }

    setShowQuestions = () => {
        this.state.showQuestions = true;
        this.setState(this.state);
    }

    onBackButtonPress = () => {
        RootNavigation.navigate("StartScreen");
    }

    evaluateAnswers = (answers) => {
        let seasonType = SeasonTypeAlgorithm.getSeasonTypeForParams(answers);

        answers["seasonType"] = seasonType;
        answers["eyeColor"] = answers["eyeColor"][0] === "0" ? "#0000ff" : (answers["eyeColor"][0] === "1" ? "#00bf00" : "#a65300")
        answers["skinColor"] = answers["skinColor"][0] === "0" ? "#E1C699" : "#8D5524"

        DatabaseHandler.storeObject("userData", answers).then(() => {
            console.log("Stored object for the user")
            RootNavigation.navigate("StartScreen");
        });
    }

    render = () => {
        const questions = [
            { id: "0", title: 'Selektiere deine Augenfarbe?', modalTitle: "Selektiere den %ston deiner Augen", type: 'SELECT_SEASON_TYPE', options: [{"key": "Blau", "value": "0", "hex": "#1130a0", "options": [{"key": "Reines Blau", "value": "0", "hex": "#1130a0"}, {"key": "Blaugrün", "value": "1", "hex": "#16606b"}, {"key": "Blaugrau", "value": "2", "hex": "#364d76"}]},{"key": "Grün", "value": "1", "hex": "#4d8533", "options": [{"key": "Reines Grün", "value": "3", "hex": "#4d8533"}, {"key": "Grünbraun", "value": "4", "hex": "#566111"}, {"key": "Grüngrau", "value": "5", "hex": "#7a926f"}]}, {"key": "Braun", "value": "3", "hex": "#5e4122", "options": [{"key": "Reines Braun", "value": "6", "hex": "#5e4122"}, {"key": "Braungrün", "value": "7", "hex": "#655111"}, {"key": "Schwarzbraun", "value": "8", "hex": "#42331e"}]}], storeAs: 'eyeColor'},
            { id: '1', title: 'Selektiere deine natürliche Haarfarbe?', modalTitle: "Selektiere den %ston deiner Haare", type: 'SELECT_SEASON_TYPE', options: [{"key": "Blond", "value": "0", "hex": "#fbe176", "options": [{"key": "Hellblond", "value": "0", "hex": "#e6d8a6"}, {"key": "Aschblond", "value": "1", "hex": "#bdb18b"}, {"key": "Goldblond", "value": "2", "hex": "#c99e54"}, {"key": "Rotblond", "value": "3", "hex": "#ca7530"}]}, {"key": "Rot", "value": "1", "hex": "#6a1713", "options": [{"key": "Reines Rot", "value": "4", "hex": "#6a1713"}, {"key": "Rotblond", "value": "5", "hex": "#e19c4e"}, {"key": "Kupfer", "value": "6", "hex": "#b95f34"}]}, {"key": "Braun", "value": "2", "hex": "#684f34", "options": [{"key": "Goldbraun", "value": "7", "hex": "#a96716"}, {"key": "Hellbraun", "value": "8", "hex": "#9b7e4d"}, {"key": "Rotbraun", "value": "9", "hex": "#62351c"}, {"key": "Schwarzbraun", "value": "10", "hex": "#3a2620"}]}, {"key": "Schwarz", "value": "3", "hex": "#131313", "options": [{"key": "Schwarz", "value": "11", "hex": "#131313"}, {"key": "Blauschwarz", "value": "12", "hex": "#23213e"}, {"key": "Braunschwarz", "value": "13", "hex": "#3c1f1a"}]}], storeAs: 'hairColor'},
            { id: '2', title: 'Selektiere deine Hautfarbe?', type: 'SELECT_SKIN_TONE', storeAs: 'skinColor' },
            { id: '3', title: 'Welche Farben magst du?', type: 'MARTIAN_COLOR_MULTI_SELECT', storeAs: 'desirableColors'},
            { id: '4', title: 'Welche Farben magst du nicht?', type: 'MARTIAN_COLOR_MULTI_SELECT',  storeAs: 'undesirableColors'}

            // { id: "0", title: 'Möchtest du auffallen?', type: 'STANDARD_DYNAMIC', options: [{"key": "Ja", "value": false}, {"key": "Nein", "value": true}], storeAs: "wantToStandOut"},
            // { id: "1", title: 'Möchtest du deinen Augen schmeicheln?', type: 'STANDARD_DYNAMIC', options: [{"key": "Ja", "value": false}, {"key": "Nein", "value": true}, {"key": "Mir egal", "value": null}], storeAs: "focusEyeColor"},
            // { id: "2", title: 'Gesättige- oder Grelle Farben?', type: 'STANDARD_DYNAMIC', options: [{"key": "Gesättigte Farben", "value": false}, {"key": "Grelle Farben", "value": true}, {"key": "Mir egal", "value": null}], storeAs: "preferSaturatedColors"},
            // { id: "3", title: 'Magst du eher helle- oder dunkle Farben?', type: 'STANDARD_DYNAMIC', options: [{"key": "Helle Farben", "value": false}, {"key": "Dunkle Farben", "value": true}, {"key": "Mir egal", "value": null}], storeAs: "preferLightColors"},
            // { id: "4", title: 'Welche Farbe haben deine Schuhe?', type: 'MARTIAN_COLOR', storeAs: "shoes"},
            // { id: "5", title: 'Welche Farbe hat deine Hose?', type: 'MARTIAN_COLOR', storeAs: "trousers"},
            // { id: "6", title: 'Trägst du eine Jacke?', type: 'STANDARD_DYNAMIC', options: [{"key": "Ja", "value": true}, {"key": "Nein", "value": false}], isConditional: true},
            // { id: "7", title: 'Welche Farbe hat deine Jacke?', type: 'MARTIAN_COLOR', storeAs: "jacket", skipWhen: false},
            // { id: "8", title: 'Test?', type: 'STANDARD'}
        ];

        return (
            <TouchableOpacity style={GlobalStyle.commonContainer} activeOpacity={0.8} onPress={() => this.setShowQuestions()}>
                <View>
                    <Text style={GlobalStyle.commonTitle}>Build me!</Text>
                </View>

                <QuestionHandler questions={questions} showQuestions={this.state.showQuestions} onComplete={(answers) => {this.evaluateAnswers(answers)}} onReturn={this.onBackButtonPress}></QuestionHandler>

            </TouchableOpacity>

        )
    }
};

