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
        { id: "0", title: 'Why is the sky blue?', type: 'standard' },
        { id: '1', title: 'Who invented pizza?', type: 'pre color', colors: ['#ff0000', '#623174', '#590000', '#a67400', '#ff8000'] },
        { id: '2', title: 'Is green tea overrated?', type: 'all color' },
    ];

    return (
        <TouchableOpacity style={GlobalStyle.commonContainer} activeOpacity={0.8} onPress={() => setShowQuestions(true)}>
            <View>
                <Text style={GlobalStyle.commonTitle}>Build me!</Text>
            </View>

            <Modal visible={showQuestions} animationType={'slide'}>
                <QuestionHandler questions={questions}></QuestionHandler>
            </Modal>
        </TouchableOpacity>

    )
};

