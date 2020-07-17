import React, {useState} from 'react';
import {Text, View, Button, StyleSheet, FlatList, TouchableOpacity, Modal, BackHandler} from "react-native";

import GlobalStyle from "../js/GlobalStyle";
import ColorHandler from "../js/ColorHandler";
import TinyColor from "../frameworks/TinyColor/tinycolor";
import Test123 from "../js/algorithm";

export default function QuestionHandler(props) {
    const [questionIndex, setQuestionIndex] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [colorSpecifications, setColorSpecifications] = useState([]);
    const [modelData, setModelData] = useState([]);

    const [answers] = useState([]);
    const [martianColor] = useState(new ColorHandler());
    const [test123] = useState(new Test123());

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
            case "SELECT":
                return (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'}}>

                        <FlatList keyExtractor={(item, index) => item.key}
                                  data={prop.options} numColumns={2} renderItem={ itemData =>
                            <TouchableOpacity onPress={() => submitAnswer(itemData.item.value)} style={styles.selectButton}>
                                <Text style={GlobalStyle.commonText}>{itemData.item.key}</Text>
                            </TouchableOpacity>
                        }>
                        </FlatList>
                    </View>
                )
            case "SELECT_SEASON_TYPE":
                return selectSelectOptionsForSeasonType(prop);

            case "PRE COLOR":
                return generatePreColors(prop.colors);

            case 'ALL COLOR':
                return generateMartianColors();
        }
    }

    const getColorsWithText = (colors) => {
        let colorsWithText = [];

        colors.forEach(color => {
            let hexValue;

            if(typeof color === 'object' && color !== null) {
                hexValue = color.hex;
            } else {
                hexValue = color;
            }

            let textObj = generateColorWithTextObj(hexValue);
            textObj.originalInput = color;

            colorsWithText.push(textObj);

        })

        return colorsWithText;
    }

    const generateColorWithTextObj = (colorHex) => {
        let colorTinyObject, textColor;

        colorTinyObject = TinyColor(colorHex);
        textColor = colorTinyObject.isDark() ? "white" : "black";

        return {
            hex: colorHex,

            squareStyle: {
                backgroundColor: colorHex
            },

            textStyle: {
                color: textColor
            }
        }
    }

    // ----------------------------------------------------------------------------------------------------------------
    // Methods for generating the components for the question types

    const generatePreColors = (colors) => {
        let colorsWithText = getColorsWithText(colors);

        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <FlatList keyExtractor={(item, index) => item} contentContainerStyle={styles.colorContainer}
                          data={colorsWithText} numColumns={2} renderItem={ itemData =>
                    <TouchableOpacity onPress={() => submitAnswer(itemData.item.hex)} style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
                        <View style={styles.colorSquareContentContainer}>
                            <Text style={[styles.colorSquareText, itemData.item.textStyle]}>Test</Text>
                        </View>
                    </TouchableOpacity>
                }>
                </FlatList>
            </View>
        )

    }

    const selectSelectOptionsForSeasonType = (props) => {
        let options = props.options;

        if(props.id === "2") {
            options = test123.getSelectableForSkinTone(answers);
        }

        return (
            <View>
                <View>
                    <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={styles.colorContainer}
                              data={getColorsWithText(options)} numColumns={2} renderItem={ itemData =>
                        <TouchableOpacity onPress={() => generateModalData(itemData.item.originalInput)} style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
                            <View style={styles.colorSquareContentContainer}>
                                <Text style={[styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.key}</Text>
                            </View>
                        </TouchableOpacity>
                    }>
                    </FlatList>
                </View>

                <Modal visible={showModal} animationType={'fade'}>
                    <View style={GlobalStyle.commonContainer}>
                        <View>
                            <Text style={GlobalStyle.commonTitle}>Wähle den Unterton</Text>
                        </View>
                        <View style={{padding: 25}}>
                            <FlatList keyExtractor={(item, index) => item.hex} numColumns={2} data={modelData}
                                      contentContainerStyle={styles.colorContainer} renderItem={itemData =>
                                <TouchableOpacity style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]} onPress={() => submitAnswer(itemData.item.originalInput.value)}>
                                    <View style={styles.colorSquareContentContainer}>
                                        <Text style={[styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.key}</Text>
                                    </View>
                                </TouchableOpacity>}>
                            </FlatList>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    const generateMartianColors = () => {
        let colorsWithText = getColorsWithText(martianColor.getAllRepresentativeColors());

        return (
            <View>
                <View>
                    <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={styles.colorContainer}
                              data={colorsWithText} numColumns={2} renderItem={ itemData =>
                        <TouchableOpacity onPress={() => getColorSpecifications(itemData.item.originalInput)} style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
                            <View style={styles.colorSquareContentContainer}>
                                <Text style={[styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }>
                    </FlatList>
                </View>

                <Modal visible={showModal} animationType={'fade'}>
                    <View style={GlobalStyle.commonContainer}>
                        <View>
                            <Text style={GlobalStyle.commonTitle}>Wähle den Unterton</Text>
                        </View>
                        <View style={{padding: 25}}>
                            <FlatList keyExtractor={(item, index) => item.hex} numColumns={2} data={colorSpecifications}
                                      contentContainerStyle={styles.colorContainer} renderItem={itemData =>
                                <TouchableOpacity style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]} onPress={() => submitAnswer(itemData.item.originalInput)}>
                                    <View style={styles.colorSquareContentContainer}>
                                        <Text style={[styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                                    </View>
                                </TouchableOpacity>}>
                            </FlatList>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }


    const getColorStyle = (item) => {
        let backgroundColor = typeof item === "undefined" ? "black" : item;

        return {backgroundColor: backgroundColor};
    }

    const submitAnswer = (answer) => {
        setQuestionIndex(questionIndex + 1);
        addAnswer(answer);
        console.log(answers);

        if(showModal) {
            setShowModal(!showModal);
        }
    }

    const addAnswer = (answer) => {
        answers.push(answer)
    }

    const getColorSpecifications = (color) => {
        let hue = color.hsv.match(/\d+/g)[0];
        let colorObj = martianColor.getColorObjByHue(hue);
        let colors = martianColor.getColorsByColorObj(colorObj);

        let orderedColors = [colors[1], colors[3], colors[2], colors[4], colors[0]];
        let orderedColorsWithText = getColorsWithText(orderedColors);

        setColorSpecifications(orderedColorsWithText);

        setShowModal(true)
    }

    const generateModalData = (selectedItem) => {
        if(selectedItem.options) {
            addAnswer(selectedItem.value);
            let colorSpecifications = getColorsWithText(selectedItem.options);
            setModelData(colorSpecifications);
            setShowModal(true);
        } else {
            submitAnswer(selectedItem.value);
        }

        console.log("Color spec :: " + colorSpecifications);
    }

    return (
        <View style={GlobalStyle.commonContainer}>
            <Question></Question>
        </View>
    )
}

const styles = StyleSheet.create({
    modalLayout: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#2b3940',
    },

    colorContainer: {
        alignItems: 'center',
        padding: 10
    },

    colorSquare: {
        width: 130,
        height: 130,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },

    colorSquareContentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    colorSquareText: {
        color: 'white',
        marginBottom: 10
    },

    selectButton: {
        width: 125,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#2b3940',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        margin: 10
    }
})