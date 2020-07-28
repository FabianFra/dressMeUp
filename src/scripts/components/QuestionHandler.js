import React, {useState, Component} from 'react';
import {Text, View, TouchableOpacity, FlatList, StyleSheet, Modal} from "react-native";

import GlobalStyle from "../js/GlobalStyle";
import ColorHandler from "../js/ColorHandler";
import TinyColor from "../frameworks/TinyColor/tinycolor";
import SeasonTypeAlgorithm from "../js/SeasonTypeAlgorithm";



export default class QuestionHandler extends Component {
    constructor(props) {
        super(props);
        this.initializeState();
    }

    render() {
        let question = this.getCurrentQuestion();
        let answers = this.state.answers;

        return (
            <Modal animationType={'slide'} visible={this.props.showQuestions} onRequestClose={() => this.handleBackButtonsPress()}>
                <Question question={question} answers={answers} onSubmit={this.submitAnswer}></Question>
            </Modal>
        )
    }

    handleBackButtonsPress = () => {
        let questionIndex = this.state.questionIndex;

        if(questionIndex === 0) {
            this.props.onReturn();
        } else {
            let question = this.getCurrentQuestion();
            this.state.questionIndex--;
            let questionIndex = this.state.questionIndex;

            if(questionIndex === 0) {
                this.state.answers = [];
            } else {
                if(question.type.toUpperCase() === "SELECT_SEASON_TYPE") {
                    this.state.answers = this.state.answers.slice(0, questionIndex + 1);
                } else {
                    this.state.answers = this.state.answers.slice(0, 0 - questionIndex);
                }
            }

            this.refreshView();
        }
    }

    refreshView = () => {
        this.setState(this.state);
    }

    initializeState = () => {
        this.state = {
            questions: this.props.questions,
            questionIndex: 0,

            answers: []
        }
    }

    submitAnswer = (answer) => {
        this.handleSubmit(answer);

        if(this.state.questionIndex < this.state.questions.length) {
            this.refreshView();
        } else {
            this.props.onComplete(this.state.answers);
        }
    }

    handleSubmit = (answer) => {
        this.state.questionIndex++;
        this.state.answers = this.state.answers.concat(answer);
    }

    // Getter / Setter

    getCurrentQuestion = () => {
        return this.state.questions[this.state.questionIndex];
    }
}

class Question extends Component {
    constructor(props) {
        super(props);
        this.initializeState();
        this.createStyleSheet();

        this.martianColor = new ColorHandler();
    }

    initializeState = () => {
        this.state = {
            showModal: false,
            modalElements: [],
            modalTitle: "",

            answers: [],
            selectedElements: []
        }
    }

    render() {
        let question = this.props.question;

        return (
            this.QuestionInput(question)
        )
    }

    QuestionInput = (question) => {
        let type = question.type;

        switch (type.toUpperCase()) {
            case "STANDARD":
                return this.generateStandardQuestion(question);
            case "SELECT_SEASON_TYPE":
                return this.generateSeasonTypeQuestion(question);
            case "MULTI_SELECT":
                return this.generateMultiSelectQuestion(question);
            case "MARTIAN_COLOR":
                return this.generateMartianColorsQuestion(question);
        }
    }

    // Generators for question ui

    createStyleSheet = () => {
        this.styles = StyleSheet.create({
            colorContainer: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            },

            colorSquare: {
                width: 130,
                height: 130,
                margin: 10,
                backgroundColor: 'white',
                borderRadius: 10
            },

            colorSquareContentContainer: {
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center'
            },

            colorSquareText: {
                color: 'white',
                margin: 10,
                textAlign: 'center'
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
            },

            allContainer: {
                flex: 1,
                backgroundColor: '#2b3940',
            }


        })
    }

    generateStandardQuestion = (question) => {
        return (
            <View style={GlobalStyle.commonContainer}>
                <View>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <View style={{padding: 25}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'}}>
                        <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => this.props.onSubmit("true")}>
                            <Text style={GlobalStyle.commonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => this.props.onSubmit("false")}>
                            <Text style={GlobalStyle.commonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    generateSeasonTypeQuestion = (question) => {
        let options = question.options;

        if(question.id === "2") {
            options = SeasonTypeAlgorithm.getSelectableForSkinTone(this.props.answers);
        }

        return (
            <View style={this.styles.allContainer}>
                <View>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={this.styles.colorContainer}
                          data={this.getColorsWithText(options)} numColumns={2} renderItem={ itemData =>
                    <TouchableOpacity onPress={() => this.generateModalData(itemData.item.originalInput)} style={[this.styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
                        <View style={this.styles.colorSquareContentContainer}>
                            <Text style={[this.styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.key}</Text>
                        </View>
                    </TouchableOpacity>
                }>
                </FlatList>
                <Modal visible={this.state.showModal} animationType={'fade'} onRequestClose={() => this.handleBackButtonPress()}>
                    <View style={this.styles.allContainer}>
                        <View>
                            <Text style={GlobalStyle.commonTitle}>{this.state.modalTitle}</Text>
                        </View>
                        <FlatList keyExtractor={(item, index) => item.hex} numColumns={2} data={this.state.modalElements}
                                  contentContainerStyle={this.styles.colorContainer} renderItem={itemData =>
                            <TouchableOpacity style={[this.styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]} onPress={() => { this.state.answers.push(itemData.item.originalInput.value); this.state.showModal = false; this.props.onSubmit(this.state.answers); this.state.answers = [] }}>
                                <View style={this.styles.colorSquareContentContainer}>
                                    <Text style={[this.styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.key}</Text>
                                </View>
                            </TouchableOpacity>}>
                        </FlatList>
                    </View>
                </Modal>
            </View>
        )
    }

    generateMultiSelectQuestion = (question) => {
        let colorsWithText = this.getColorsWithText(this.martianColor.getAllRepresentativeColors());

        return (
            <View style={this.styles.allContainer}>
                <View>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <View style={this.styles.colorContainer}>
                    <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={{alignItems: 'center', padding: 10}}
                              data={colorsWithText} numColumns={2} renderItem={ itemData =>
                        <TouchableOpacity onPress={() => this.handleSelectedElements(itemData.item.hex)} style={[this.styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
                            <View style={this.styles.colorSquareContentContainer}>
                                <Text style={[this.styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }>
                    </FlatList>
                    <TouchableOpacity style={[GlobalStyle.commonButton, {"marginBottom": 15, "width": 300}]} onPress={() => this.props.onSubmit(this.state.selectedElements)}>
                        <Text style={GlobalStyle.commonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    generateMartianColorsQuestion = (question) => {
        let colorsWithText = this.getColorsWithText(this.martianColor.getAllRepresentativeColors());

        return (
            <View style={this.styles.allContainer}>
                <View>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <View style={this.styles.colorContainer}>
                    <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={{alignItems: 'center', padding: 10}}
                              data={colorsWithText} numColumns={2} renderItem={ itemData =>
                        <TouchableOpacity onPress={() => this.getColorSpecifications(itemData.item.originalInput)} style={[this.styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
                            <View style={this.styles.colorSquareContentContainer}>
                                <Text style={[this.styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }>
                    </FlatList>
                </View>

                <Modal visible={this.state.showModal} animationType={'fade'} onRequestClose={() => this.handleBackButtonPress()}>
                    <View style={this.styles.allContainer}>
                        <View>
                            <Text style={GlobalStyle.commonTitle}>{this.state.modalTitle}</Text>
                        </View>
                        <FlatList keyExtractor={(item, index) => item.hex} numColumns={2} data={this.state.colorSpecifications}
                                  contentContainerStyle={this.styles.colorContainer} renderItem={itemData =>
                            <TouchableOpacity style={[this.styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]} onPress={() => { this.state.answers.push(itemData.item.originalInput.value); this.state.showModal = false; this.props.onSubmit(this.state.answers); this.state.answers = [] }}>
                                <View style={this.styles.colorSquareContentContainer}>
                                    <Text style={[this.styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                                </View>
                            </TouchableOpacity>}>
                        </FlatList>
                    </View>
                </Modal>
            </View>
        )
    }


    handleBackButtonPress = () => {
        this.state.showModal = false;
        this.state.answers.pop();
        this.setState(this.state);
    }

    // Convenience methods

    getColorsWithText = (colors) => {
        let colorsWithText = [];

        colors.forEach(color => {
            let hexValue;

            if(typeof color === 'object' && color !== null) {
                hexValue = color.hex;
            } else {
                hexValue = color;
            }

            let textObj = this.generateColorWithTextObj(hexValue);
            textObj.originalInput = color;

            colorsWithText.push(textObj);

        })

        return colorsWithText;
    }

    generateColorWithTextObj = (colorHex) => {
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

    handleSelectedElements = (key) => {
        let selectedElements = this.state.selectedElements;

        if(selectedElements.includes(key)) {
            let index = selectedElements.indexOf(key);
            selectedElements.splice(index, 1);
        } else {
            selectedElements.push(key);
        }

        this.state.selectedElements = selectedElements;
        this.setState(this.state);
    }

    generateModalData = (selectedItem) => {
        if(selectedItem.options) {
            let colorSpecifications = this.getColorsWithText(selectedItem.options);
            this.state.modalElements = colorSpecifications;
            this.state.modalTitle = this.getTitleForModal(selectedItem.key);
            this.state.showModal = true;
        }

        this.state.answers.push(selectedItem.value);

        this.setState(this.state);
    }

    getTitleForModal = (value) => {
        let type = this.props.question.type.toUpperCase();
        let modalTitle = this.props.question.modalTitle;

        switch (type) {
            case "MARTIAN_COLOR":
            case "SELECT_SEASON_TYPE":
                if(typeof modalTitle === "undefined") {
                    modalTitle = this.props.question.title;
                } else {
                    modalTitle = modalTitle.replace("%s", value);
                }
                break;
            default:
                modalTitle = "No title assigned!";
        }

        return modalTitle
    }

    getColorSpecifications = (color) => {
        let colorSpecifications = undefined;

        if(color.name === "Black" || color.name === "White") {
            this.state.showModal = false;
            this.props.onSubmit(color.hex);
        } else {
            if(color.specifications) {
                colorSpecifications = color.specifications;
            } else {
                let hue = this.martianColor.getColorHue(color);
                let colorObj = this.martianColor.getColorObjByHue(hue);
                let colors = this.martianColor.getColorsByColorObj(colorObj);
                let orderedColors = [colors[1], colors[3], colors[2], colors[4], colors[0]]
                colorSpecifications = orderedColors;
            }

            this.state.colorSpecifications = this.getColorsWithText(colorSpecifications);
            this.state.modalTitle = this.getTitleForModal(color.name);
            this.state.showModal = true;
        }

        this.setState(this.state);
    }
}

//export default function QuestionHandler(props) {
//    const [questionIndex, setQuestionIndex] = useState(0)
//    const [showModal, setShowModal] = useState(false);
//    const [colorSpecifications, setColorSpecifications] = useState([]);
//    const [modelData, setModelData] = useState([]);
//    const [selectedElements, setSelectedElements] = useState([]);
//
//    const [answers] = useState([]);
//    const [martianColor] = useState(new ColorHandler());
//    const [test123] = useState(new Test123());
//
//    const questions = props.questions;
//
//    const Question = () => {
//        let question = questions[questionIndex];
//
//        return (
//            <View style={GlobalStyle.commonContainer}>
//                <View>
//                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
//                </View>
//                <View style={{padding: 25}}>
//                    <QuestionInput question={question}></QuestionInput>
//                </View>
//            </View>
//        )
//    }
//
//    const QuestionInput = (props) => {
//        let prop = props.question;
//
//        switch (prop.type.toUpperCase()) {
//            case "STANDARD":
//                return (
//                    <View style={{
//                        flexDirection: 'row',
//                        alignItems: 'center',
//                        justifyContent: 'center'}}>
//                        <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => submitAnswer("true")}>
//                            <Text style={GlobalStyle.commonText}>Yes</Text>
//                        </TouchableOpacity>
//                        <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => submitAnswer("false")}>
//                            <Text style={GlobalStyle.commonText}>No</Text>
//                        </TouchableOpacity>
//                    </View>
//                )
//            case "SELECT":
//                return (
//                    <View style={{
//                        flexDirection: 'row',
//                        alignItems: 'center',
//                        justifyContent: 'center'}}>
//
//                        <FlatList keyExtractor={(item, index) => item.key}
//                                  data={prop.options} numColumns={2} renderItem={ itemData =>
//                            <TouchableOpacity onPress={() => submitAnswer(itemData.item.value)} style={styles.selectButton}>
//                                <Text style={GlobalStyle.commonText}>{itemData.item.key}</Text>
//                            </TouchableOpacity>
//                        }>
//                        </FlatList>
//                    </View>
//                )
//            case "SELECT_SEASON_TYPE":
//                return selectSelectOptionsForSeasonType(prop);
//
//            case "PRE COLOR":
//                return generatePreColors(prop.colors);
//
//            case 'ALL COLOR':
//                return generateMartianColors();
//
//            case "MULTI SELECT":
//                return generateMultiSelect();
//        }
//    }
//
//    const getColorsWithText = (colors) => {
//        let colorsWithText = [];
//
//        colors.forEach(color => {
//            let hexValue;
//
//            if(typeof color === 'object' && color !== null) {
//                hexValue = color.hex;
//            } else {
//                hexValue = color;
//            }
//
//            let textObj = generateColorWithTextObj(hexValue);
//            textObj.originalInput = color;
//
//            colorsWithText.push(textObj);
//
//        })
//
//        return colorsWithText;
//    }
//
//    const generateColorWithTextObj = (colorHex) => {
//        let colorTinyObject, textColor;
//
//        colorTinyObject = TinyColor(colorHex);
//        textColor = colorTinyObject.isDark() ? "white" : "black";
//
//        return {
//            hex: colorHex,
//
//            squareStyle: {
//                backgroundColor: colorHex
//            },
//
//            textStyle: {
//                color: textColor
//            }
//        }
//    }
//
//    const handleSelectedElements = (key) => {
//        let sE = selectedElements;
//
//        if(selectedElements.includes(key)) {
//            let index = selectedElements.indexOf(key);
//            sE.splice(index, 1);
//        } else {
//            sE.push(key);
//        }
//        setSelectedElements(sE);
//    }
//
//    // ----------------------------------------------------------------------------------------------------------------
//    // Methods for generating the components for the question types
//
//    const generateMultiSelect = (colors) => {
//        let colorsWithText = getColorsWithText(martianColor.getAllRepresentativeColors());
//
//        return (
//            <View>
//                <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={styles.colorContainer}
//                          data={colorsWithText} numColumns={2} renderItem={ itemData =>
//                    <TouchableOpacity onPress={() => handleSelectedElements(itemData.item.hex)} style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
//                        <View style={styles.colorSquareContentContainer}>
//                            <Text style={[styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
//                        </View>
//                    </TouchableOpacity>
//                }>
//                </FlatList>
//                <TouchableOpacity style={[GlobalStyle.commonButton, {"marginBottom": 15, "width": 300}]} onPress={() => submitAnswer(selectedElements)}>
//                    <Text style={GlobalStyle.commonText}>Done</Text>
//                </TouchableOpacity>
//            </View>
//        )
//    }
//
//    const generatePreColors = (colors) => {
//        let colorsWithText = getColorsWithText(colors);
//
//        return (
//            <View style={{flex: 1, flexDirection: 'row'}}>
//                <FlatList keyExtractor={(item, index) => item} contentContainerStyle={styles.colorContainer}
//                          data={colorsWithText} numColumns={2} renderItem={ itemData =>
//                    <TouchableOpacity onPress={() => submitAnswer(itemData.item.hex)} style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
//                        <View style={styles.colorSquareContentContainer}>
//                            <Text style={[styles.colorSquareText, itemData.item.textStyle]}>Test</Text>
//                        </View>
//                    </TouchableOpacity>
//                }>
//                </FlatList>
//            </View>
//        )
//
//    }
//
//    const selectSelectOptionsForSeasonType = (props) => {
//        let options = props.options;
//
//        if(props.id === "2") {
//            options = test123.getSelectableForSkinTone(answers);
//        }
//
//        return (
//            <View>
//                <View>
//                    <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={styles.colorContainer}
//                              data={getColorsWithText(options)} numColumns={2} renderItem={ itemData =>
//                        <TouchableOpacity onPress={() => generateModalData(itemData.item.originalInput)} style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
//                            <View style={styles.colorSquareContentContainer}>
//                                <Text style={[styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.key}</Text>
//                            </View>
//                        </TouchableOpacity>
//                    }>
//                    </FlatList>
//                </View>
//
//                <Modal visible={showModal} animationType={'fade'}>
//                    <View style={GlobalStyle.commonContainer}>
//                        <View>
//                            <Text style={GlobalStyle.commonTitle}>Wähle den Unterton</Text>
//                        </View>
//                        <View style={{padding: 25}}>
//                            <FlatList keyExtractor={(item, index) => item.hex} numColumns={2} data={modelData}
//                                      contentContainerStyle={styles.colorContainer} renderItem={itemData =>
//                                <TouchableOpacity style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]} onPress={() => submitAnswer(itemData.item.originalInput.value)}>
//                                    <View style={styles.colorSquareContentContainer}>
//                                        <Text style={[styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.key}</Text>
//                                    </View>
//                                </TouchableOpacity>}>
//                            </FlatList>
//                        </View>
//                    </View>
//                </Modal>
//            </View>
//        )
//    }
//
//    const generateMartianColors = () => {
//        let colorsWithText = getColorsWithText(martianColor.getAllRepresentativeColors());
//
//        return (
//            <View>
//                <View>
//                    <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={styles.colorContainer}
//                              data={colorsWithText} numColumns={2} renderItem={ itemData =>
//                        <TouchableOpacity onPress={() => getColorSpecifications(itemData.item.originalInput)} style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
//                            <View style={styles.colorSquareContentContainer}>
//                                <Text style={[styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
//                            </View>
//                        </TouchableOpacity>
//                    }>
//                    </FlatList>
//                </View>
//
//                <Modal visible={showModal} animationType={'fade'}>
//                    <View style={GlobalStyle.commonContainer}>
//                        <View>
//                            <Text style={GlobalStyle.commonTitle}>Wähle den Unterton</Text>
//                        </View>
//                        <View style={{padding: 25}}>
//                            <FlatList keyExtractor={(item, index) => item.hex} numColumns={2} data={colorSpecifications}
//                                      contentContainerStyle={styles.colorContainer} renderItem={itemData =>
//                                <TouchableOpacity style={[styles.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]} onPress={() => submitAnswer(itemData.item.originalInput)}>
//                                    <View style={styles.colorSquareContentContainer}>
//                                        <Text style={[styles.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
//                                    </View>
//                                </TouchableOpacity>}>
//                            </FlatList>
//                        </View>
//                    </View>
//                </Modal>
//            </View>
//        )
//    }
//
//
//    const getColorStyle = (item) => {
//        let backgroundColor = typeof item === "undefined" ? "black" : item;
//
//        return {backgroundColor: backgroundColor};
//    }
//
//    const submitAnswer = (answer) => {
//        setQuestionIndex(questionIndex + 1);
//        addAnswer(answer);
//
//        if(showModal) {
//            setShowModal(!showModal);
//        }
//    }
//
//    const addAnswer = (answer) => {
//        answers.push(answer)
//    }
//
//    const getColorSpecifications = (color) => {
//        let hue = color.hsv.match(/\d+/g)[0];
//        let colorObj = martianColor.getColorObjByHue(hue);
//        let colors = martianColor.getColorsByColorObj(colorObj);
//
//        let orderedColors = [colors[1], colors[3], colors[2], colors[4], colors[0]];
//        let orderedColorsWithText = getColorsWithText(orderedColors);
//
//        setColorSpecifications(orderedColorsWithText);
//
//        setShowModal(true)
//    }
//
//    const generateModalData = (selectedItem) => {
//        if(selectedItem.options) {
//            addAnswer(selectedItem.value);
//            let colorSpecifications = getColorsWithText(selectedItem.options);
//            setModelData(colorSpecifications);
//            setShowModal(true);
//        } else {
//            submitAnswer(selectedItem.value);
//        }
//
//        console.log("Color spec :: " + colorSpecifications);
//    }
//
//    return (
//        <View style={GlobalStyle.commonContainer}>
//            <Question></Question>
//        </View>
//    )
//}
//
//const styles = StyleSheet.create({
//    modalLayout: {
//        flex: 1,
//        justifyContent: 'center',
//        backgroundColor: '#2b3940',
//    },
//
//    colorContainer: {
//        alignItems: 'center',
//        padding: 10
//    },
//
//    colorSquare: {
//        width: 130,
//        height: 130,
//        margin: 10,
//        backgroundColor: 'white',
//        borderRadius: 10
//    },
//
//    colorSquareContentContainer: {
//        flex: 1,
//        justifyContent: 'flex-end',
//        alignItems: 'center'
//    },
//
//    colorSquareText: {
//        color: 'white',
//        marginBottom: 10
//    },
//
//    selectButton: {
//        width: 125,
//        alignItems: 'center',
//        padding: 10,
//        backgroundColor: '#2b3940',
//        borderWidth: 1,
//        borderColor: 'white',
//        borderRadius: 10,
//        margin: 10
//    }
//})