import React, {useState} from 'react';
import {Text, View, Button, StyleSheet, FlatList, TouchableOpacity} from "react-native";

import GlobalStyle from "../js/GlobalStyle";
import ColorHandler from "../js/ColorHandler";


export default function QuestionHandler(props) {
    const [questionIndex, setQuestionIndex] = useState(0)
    const [showMonochromatic, setShowMonochromatic] = useState(false);
    const [answers] = useState([]);
    const [martianColor] = useState(new ColorHandler())

    const questions = props.questions;

    const Question = () => {
        let question = questions[questionIndex];

        return (
            <View style={GlobalStyle.commonContainer}>
                <View>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <View style={{padding: 25}}>
                    <QuestionInput question={question}></QuestionInput>
                </View>
            </View>
        )
    }

    const QuestionInput = (props) => {
        let prop = props.question;

        switch (prop.type.toUpperCase()) {
            case "STANDARD":
                return (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'}}>
                        <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => submitAnswer("true")}>
                            <Text style={GlobalStyle.commonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => submitAnswer("false")}>
                            <Text style={GlobalStyle.commonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                )
            case "PRE COLOR":
                return (
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <FlatList keyExtractor={(item, index) => item}
                                  data={prop.colors} numColumns={4} renderItem={ itemData =>
                                        <TouchableOpacity onPress={() => submitAnswer(itemData.item)} style={[GlobalStyle.commonSquare, getColorStyle(itemData.item)]}></TouchableOpacity>
                                  }>
                        </FlatList>
                    </View>
                )
            case 'ALL COLOR':
                return getFirstColors();
        }
    }

    const getColorStyle = (item) => {
        return {backgroundColor: item};
    }

    const submitAnswer = (answer) => {
        setQuestionIndex(questionIndex + 1);
        addAnswer(answer);
        console.log(answers);
    }

    const addAnswer = (answer) => {
        answers.push(answer)
    }

    const getFirstColors = () => {
        let allColors = martianColor.getAllRepresentativeColors();

        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <FlatList keyExtractor={(item, index) => item.hex}
                          data={allColors} numColumns={4} renderItem={ itemData =>
                    <TouchableOpacity onPress={() => submitAnswer(itemData.item.hex)} style={[GlobalStyle.commonSquare, getColorStyle(itemData.item.hex)]}></TouchableOpacity>
                }>
                </FlatList>
            </View>
        )
    }

    return (
        <View style={GlobalStyle.commonContainer}>
            <Question></Question>
        </View>
    )
}