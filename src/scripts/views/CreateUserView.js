import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal} from "react-native";
import { useNavigation } from '@react-navigation/native';

import GlobalStyle from "../js/GlobalStyle";
import QuestionHandler from "../components/QuestionHandler";

export default function CreateUserView() {
    const [questionIndex, setQuestionIndex] = useState(0)
    const [showQuestions, setShowQuestions] = useState(false);

    const navigation = useNavigation();
    const view = 'HomeScreen';


    const questions = [
        { id: "0", title: 'Selektiere deine Augenfarbe?', type: 'SELECT_SEASON_TYPE', options: [{"key": "Blau", "value": "0", "hex": "#1130a0", "options": [{"key": "Reines Blau", "value": "0", "hex": "#1130a0"}, {"key": "Blaugrün", "value": "1", "hex": "#16606b"}, {"key": "Blaugrau", "value": "2", "hex": "#364d76"}]},{"key": "Grün", "value": "1", "hex": "#4d8533", "options": [{"key": "Reines Grün", "value": "3", "hex": "#4d8533"}, {"key": "Grünbraun", "value": "4", "hex": "#566111"}, {"key": "Grüngrau", "value": "5", "hex": "#7a926f"}]}, {"key": "Braun", "value": "3", "hex": "#5e4122", "options": [{"key": "Reines Braun", "value": "6", "hex": "#5e4122"}, {"key": "Braungrün", "value": "7", "hex": "#655111"}, {"key": "Schwarzbraun", "value": "8", "hex": "#42331e"}]}]},
        { id: '1', title: 'Selektiere deine natürliche Haarfarbe?', type: 'SELECT_SEASON_TYPE', options: [{"key": "Blond", "value": "0", "hex": "#fbe176", "options": [{"key": "Hellblond", "value": "0", "hex": "#e6d8a6"}, {"key": "Aschblond", "value": "1", "hex": "#bdb18b"}, {"key": "Goldblond", "value": "2", "hex": "#c99e54"}, {"key": "Rotblond", "value": "3", "hex": "#ca7530"}]}, {"key": "Rot", "value": "1", "hex": "#6a1713", "options": [{"key": "Reines Rot", "value": "4", "hex": "#6a1713"}, {"key": "Rotblond", "value": "5", "hex": "#e19c4e"}, {"key": "Kupfer", "value": "6", "hex": "#b95f34"}]}, {"key": "Braun", "value": "2", "hex": "#684f34", "options": [{"key": "Goldbraun", "value": "7", "hex": "#a96716"}, {"key": "Hellbraun", "value": "8", "hex": "#9b7e4d"}, {"key": "Rotbraun", "value": "9", "hex": "#62351c"}, {"key": "Schwarzbraun", "value": "10", "hex": "#3a2620"}]}, {"key": "Schwarz", "value": "3", "hex": "#131313", "options": [{"key": "Schwarz", "value": "11", "hex": "#131313"}, {"key": "Blauschwarz", "value": "12", "hex": "#23213e"}, {"key": "Braunschwarz", "value": "13", "hex": "#3c1f1a"}]}] },
        { id: '2', title: 'Selektiere deine Hautfarbe?', type: 'SELECT_SEASON_TYPE', options: [{"key": "eher Beige", "value": "0", "hex": "#e8d5ce"}, {"key": "eher Rosig", "value": "1", "hex": "#dbbfa3"}] },
        { id: '3', title: 'Selektiere deine Lieblingsfarben?', type: 'MULTI SELECT'}
    ];

    return (
        <TouchableOpacity style={GlobalStyle.commonContainer} activeOpacity={0.8} onPress={() => setShowQuestions(true)}>
            <View>
                <Text style={GlobalStyle.commonTitle}>Build me!</Text>
            </View>

            <Modal visible={showQuestions} animationType={'slide'}>
                <QuestionHandler questions={questions} onComplete={() => {console.log("Is complete")}}></QuestionHandler>
            </Modal>
        </TouchableOpacity>

    )
};

