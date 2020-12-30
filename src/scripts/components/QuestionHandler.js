import React, {Component} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import GlobalStyle from "../js/GlobalStyle";
import MartianColorHandler from "../../../FabscheAlgorithmus/src/scripts/MartianColorHandler";
import TinyColor from "../../../FabscheAlgorithmus/frameworks/TinyColor/tinycolor";
import SeasonTypeHandler from "../js/SeasonTypeHandler";

import HelperTool from "../../../FabscheAlgorithmus/src/scripts/Helpertool";
import MartianColorSelect from "./MartianColorSelect";

/*
 * Der QuestionHandler ist eine generische Lösung für das Darstellen von Fragen. Bei der Integration muss lediglich ein Array
 * aus Frage-Objekten übergeben werden.
 */
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

    /**
     * Behandelt den Fall des Back-Button-Press. Innerhalb der Methode wird der Index der derzeitigen Frage zurückgesetzt
     * und die schon gegebenen Antworten überarbeitet.
     */
    handleBackButtonsPress = () => {
        let questionIndex = this.state.questionIndex;

        if(questionIndex === 0) {
            this.props.onReturn();
        } else {
            let question = this.getCurrentQuestion();
            let lastQuestion = this.getLastQuestion();

            if(HelperTool.isInArray(lastQuestion.id, this.state.skippedQuestionIndex)) {
                this.state.questionIndex -= 2;

                if(this.state.skippedQuestionIndex.length === 1) {
                    this.state.skippedQuestionIndex = [];
                } else {
                    let index = this.state.skippedQuestionIndex.indexOf(question.id - 2);
                    this.state.skippedQuestionIndex.splice(index, 1);
                }
            } else {
                this.state.questionIndex--;
                let questionIndex = this.getLastQuestionIndex(question.type);

                if(questionIndex === 0) {
                    this.state.answers = [];
                } else {
                    this.state.answers = this.state.answers.slice(0, questionIndex);
                }
            }

            this.refreshView();
        }
    }

    /**
     * Gibt den Index der letzten Frage zurück.
     *
     * @param questionType: Typ der Frage
     * @returns {number}
     */
    getLastQuestionIndex = (questionType) => {
        let lastQuestionIndex;
        let nextAnswerIndex;

        if(questionType.toUpperCase() === "SELECT_SEASON_TYPE" || questionType.toUpperCase() === "SKIN_TONE") {
            nextAnswerIndex = this.state.answers.length - 2;
        } else {
            if(HelperTool.isDeclaredAndNotNull(this.getCurrentQuestion()["isConditional"])) {
                nextAnswerIndex = this.state.answers.length;
            } else {
                nextAnswerIndex = this.state.answers.length - 1;
            }
        }

        if(nextAnswerIndex < 0) {
            lastQuestionIndex = 0;
        } else {
            lastQuestionIndex = nextAnswerIndex;
        }

        return lastQuestionIndex;
    }

    /**
     * Überschreibt den state (rerender der View)
     */
    refreshView = () => {
        this.setState(this.state);
    }

    /**
     * Hält die allgemeingültigen Informationen des States.
     */
    initializeState = () => {
        this.state = {
            martianColorHandler: new MartianColorHandler(),
            questions: this.props.questions,
            questionIndex: 0,

            skippedQuestionIndex: [],
            answers: []
        }
    }

    /**
     * Behandelt den submit einer Frage d.h. wenn der Anwender eine Frage beantwortet hat.
     * @param answer
     */
    submitAnswer = (answer) => {
        this.handleSubmit(answer);

        if(this.state.questionIndex < this.state.questions.length) {
            this.refreshView();
        } else {
            this.props.onComplete(this.createStoreObjectOfAnswers());
        }
    }

    /**
     * Bearbeitet die gegebenen Antworten zu einen Antwortobjekt, welches in der Evaluation genutzt wird
     *
     * @see SearchView.js
     * @returns {{}}
     */
    createStoreObjectOfAnswers = () => {
        let storeObject = {};

        this.state.answers.forEach(answerObject => {

            if(answerObject.answer.length === 1) {
                storeObject[answerObject.storeAs] = answerObject.answer[0];
            } else {
                storeObject[answerObject.storeAs] = answerObject.answer;
            }
        });

        return storeObject;
    }

    /**
     * Übernimmt die Logik während eines Submits
     * @param answer
     */
    handleSubmit = (answer) => {
        let question = this.getCurrentQuestion();

        if(question.isConditional) {
            let nextQuestion = this.getNextQuestion();

            if(HelperTool.isDeclared(nextQuestion.skipWhen)) {
                if(HelperTool.isIterable(nextQuestion.skipWhen)) {
                    if(HelperTool.isInArray(answer.answer[0], nextQuestion.skipWhen)) {
                        if(HelperTool.isDeclaredAndNotNull(question.storeAs)) {
                            this.state.answers = this.state.answers.concat(answer);
                        }

                        this.state.skippedQuestionIndex.push(nextQuestion.id);
                        this.state.questionIndex++;
                    }
                } else {
                    if(answer.answer[0] === nextQuestion.skipWhen) {
                        this.state.skippedQuestionIndex.push(nextQuestion.id);
                        this.state.questionIndex++;
                    }
                }
            }
        } else {
            this.state.answers = this.state.answers.concat(answer);
        }

        this.state.questionIndex++;
    }

    //-------------------------------------------------------------------------
    // Getter/Setter

    /**
     * Gibt das derzeitige Frageobjekt zurück
     * @returns {*}
     */
    getCurrentQuestion = () => {
        return this.state.questions[this.state.questionIndex];
    }

    /**
     * Gibt das letzte Frageobjekt zurück.
     * @returns {*}
     */
    getLastQuestion = () => {
        let lastQuestion;

        if(this.state.questionIndex - 1 > 0) {
            lastQuestion = this.state.questions[this.state.questionIndex - 1];
        } else {
            lastQuestion = this.state.questions[this.state.questionIndex];
        }

        return lastQuestion;
    }

    /**
     * Gibt das nächste Frageobjekt zurück.
     * @returns {*}
     */
    getNextQuestion = () => {
        let nextQuestion;

        if(this.state.questionIndex + 1 < this.state.questions.length) {
            nextQuestion = this.state.questions[this.state.questionIndex + 1];
        } else {
            nextQuestion = this.state.questions[this.state.questionIndex];
        }

        return nextQuestion;
    }
}

/*
 * Ist eine Komponente, welche eine Frage darstellt. In Version 1.0 gibt es folgende Fragetypen:
 *
 * - STANDARD
 * - STANDARD_DYNAMIC
 * - SELECT_SEASON_TYPE
 * - SELECT_SKIN_TONE
 * - MULTI_SELECT
 */
class Question extends Component {

    constructor(props) {
        super(props);
        this.initializeState();
        this.createStyleSheet();
    }

    /**
     * Hält die allgemeingültigen Informationen des States.
     */
    initializeState = () => {
        this.state = {
            colorHandler: new MartianColorHandler(),
            showModal: false,
            modalElements: [],
            modalTitle: "",

            answers: [],
            selectedElements: [],
            desirableColors: [],

        }
    }

    render() {
        let question = this.props.question;

        return (
            this.QuestionInput(question)
        )
    }

    /**
     * Beinhaltet die in der Klasse genutzten styling Informationen der UI-Elemente.
     */
    createStyleSheet = () => {
        this.styles = StyleSheet.create({
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
        })
    }

    /**
     * Übernimmt die Fallunterscheidung, welcher Fragentyp benutzt wird anhand der übegenen Frage.
     *
     * @param question: Frageobjekt, welches ein .type Attribut haben muss
     * @returns {*}
     * @constructor
     */
    QuestionInput = (question) => {
        let type = question.type;

        switch (type.toUpperCase()) {
            case "STANDARD":
                return this.generateStandardQuestion(question);
            case "STANDARD_DYNAMIC":
                return this.generateDynamicStandardQuestion(question);
            case "SELECT_SEASON_TYPE":
                return this.generateSeasonTypeQuestion(question);
            case "SELECT_SKIN_TONE":
                return this.generateSkinToneQuestion(question);
            case "MULTI_SELECT":
                return this.generateMultiSelectQuestion(question);
            case "MARTIAN_COLOR":
                return this.generateMartianColorsQuestion(question);
            case "MARTIAN_COLOR_MULTI_SELECT":
                return this.generateMartianColorsMultiSelectQuestion(question);
        }
    }

    //-------------------------------------------------------------------------
    // Generators

    /**
     * Beinhaltet die UI-Elemente für den Fragentyp STANDARD
     *
     * @param question
     * @returns {JSX.Element}
     */
    generateStandardQuestion = (question) => {
        return (
            <View style={GlobalStyle.commonContainer}>
                <View style={{paddingTop: 10}}>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <View style={{padding: 25}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'}}>
                        <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => this.props.onSubmit(true)}>
                            <Text style={GlobalStyle.commonText}>Ja</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => this.props.onSubmit(false)}>
                            <Text style={GlobalStyle.commonText}>Nein</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    /**
     * Beinhaltet die UI-Elemente für den Fragentyp STANDARD_DYNAMIC
     *
     * @param question
     * @returns {JSX.Element}
     */
    generateDynamicStandardQuestion = (question) => {

        return (
            <View style={GlobalStyle.commonContainer}>
                <View style={{paddingTop: 10}}>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <View style={{flex: 0.5, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <FlatList contentContainerStyle={{flex: 0.5, flexDirection: "column", justifyContent: "space-evenly", alignItems: "center"}} data={question.options} keyExtractor={(item, index) => item.hex} numColumns={2} renderItem={itemData =>
                            <TouchableOpacity onPress={() => this.finalizeStandardQuestion(question, itemData.item.value)}>
                                <View style={{width: 150, height: 50, backgroundColor: '#2b3940', borderRadius: 10, borderWidth: 1, borderColor: '#ffffff', marginHorizontal: 10, flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "bold", color: "white"}}>{itemData.item.key}</Text>
                                </View>
                            </TouchableOpacity>
                        }/>
                    </View>
                </View>
            </View>
        )
    }

    /**
     * Beinhaltet die UI-Elemente für den Fragentyp SELECT_SEASON_TYPE
     *
     * @param question
     * @returns {JSX.Element}
     */
    generateSeasonTypeQuestion = (question) => {
        let options = question.options;

        return (
            <View style={GlobalStyle.commonAllContainer}>
                <View style={{paddingTop: 10}}>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={GlobalStyle.colorContainer}
                          data={this.getColorsWithText(options)} numColumns={2} renderItem={ itemData =>
                    <TouchableOpacity onPress={() => this.generateModalData(itemData.item.originalInput)} style={[GlobalStyle.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
                        <View style={GlobalStyle.colorSquareContentContainer}>
                            <Text style={[GlobalStyle.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.key}</Text>
                        </View>
                    </TouchableOpacity>
                }>
                </FlatList>

                <Modal visible={this.state.showModal} animationType={'fade'} onRequestClose={() => this.handleBackButtonPress()}>
                    <View style={GlobalStyle.commonAllContainer}>
                        <View style={{paddingTop: 10}}>
                            <Text style={GlobalStyle.commonTitle}>{this.state.modalTitle}</Text>
                        </View>
                        <FlatList keyExtractor={(item, index) => item.hex} numColumns={2} data={this.state.modalElements}
                                  contentContainerStyle={GlobalStyle.colorContainer} renderItem={itemData =>
                            <TouchableOpacity style={[GlobalStyle.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]} onPress={() => { this.finalizeSeasonTypeQuestion(question, itemData.item.originalInput.value) }}>
                                <View style={GlobalStyle.colorSquareContentContainer}>
                                    <Text style={[GlobalStyle.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.key}</Text>
                                </View>
                            </TouchableOpacity>}>
                        </FlatList>
                    </View>
                </Modal>
            </View>
        )
    }

    /**
     * Beinhaltet die UI-Elemente für den Fragentyp SELECT_SKIN_TONE
     *
     * @param question
     * @returns {JSX.Element}
     */
    generateSkinToneQuestion = (question) => {
        let options = SeasonTypeHandler.getSelectableForSkinTone(this.props.answers);

        return (
            <View style={GlobalStyle.commonContainer}>
                <View style={{paddingTop: 10}}>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <View style={{flex: 0.5, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around'}}>
                            <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => this.showSkinToneSpecialisation(options[0])}>
                                <Text style={GlobalStyle.commonText}>{options[0].key}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={GlobalStyle.commonButton} onPress={() => this.showSkinToneSpecialisation(options[1])}>
                                <Text style={GlobalStyle.commonText}>{options[1].key}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Modal visible={this.state.showModal} animationType={'fade'} onRequestClose={() => this.handleBackButtonPress()}>
                    <View style={[GlobalStyle.commonContainer]}>
                        <View style = {{paddingTop: 10}}>
                            <Text style={GlobalStyle.commonTitle}>Was trifft bei dir eher zu?</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <View style={{flex: 1, width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around'}}>
                                    <TouchableOpacity style={[GlobalStyle.commonButton, {flex: 0.5}]} onPress={() => this.finalizeSkinToneQuestion(question, this.state.modalElements[0].value)}>
                                        <Text style={GlobalStyle.commonText}>{ HelperTool.isDeclaredAndNotNull(this.state.modalElements[0]) ? this.state.modalElements[0].key : '' }</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[GlobalStyle.commonButton, {flex: 0.5}]} onPress={() => this.finalizeSkinToneQuestion(question, this.state.modalElements[1].value)}>
                                        <Text style={GlobalStyle.commonText}>{ HelperTool.isDeclaredAndNotNull(this.state.modalElements[1]) ? this.state.modalElements[1].key : '' }</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    /**
     * Beinhaltet die UI-Elemente für den Fragentyp MULTI_SELECT
     *
     * @param question
     * @returns {JSX.Element}
     */
    generateMultiSelectQuestion = (question) => {
        let colorsWithText = this.getColorsWithText(this.state.colorHandler.getAllRepresentativeColors());

        return (
            <View style={GlobalStyle.commonAllContainer}>
                <View style={{paddingTop: 10}}>
                    <Text style={GlobalStyle.commonTitle}>{question.title}</Text>
                </View>
                <View style={GlobalStyle.colorContainer}>
                    <FlatList keyExtractor={(item, index) => item.hex}
                              data={colorsWithText} numColumns={2} renderItem={ itemData =>
                        <TouchableOpacity onPress={() => this.handleSelectedElements(itemData.item.hex)} style={[GlobalStyle.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow, HelperTool.isInArray(itemData.item.hex, this.state.selectedElements) ? this.styles.selectedElement : '']}>
                            <View style={GlobalStyle.colorSquareContentContainer}>
                                <Text style={[GlobalStyle.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }>
                    </FlatList>
                    <TouchableOpacity style={[GlobalStyle.commonButton, GlobalStyle.submitButton]} onPress={() => { this.finalizeMultiSelect(question) } }>
                        <Text style={GlobalStyle.commonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * Beinhaltet die UI-Elemente für den Fragentyp MARTIAN_COLOR
     *
     * @param question
     * @returns {JSX.Element}
     */
    generateMartianColorsQuestion = (question) => {
        return (
            <MartianColorSelect martianColorSelectType={MartianColorSelect.MARTIAN_COLOR_SELECT_TYPE.NORMAL} answers={this.props.answers} question={question} onSubmit={(selectedElements) => this.finalizeMartianColorSelect(question, selectedElements)}/>
        )
    }

    /**
     * Beinhaltet die UI-Elemente für den Fragentyp MARTIAN_COLOR_MULTI_SELECT
     *
     * @param question
     * @returns {JSX.Element}
     */
    generateMartianColorsMultiSelectQuestion = (question) => {
        return (
            <MartianColorSelect martianColorSelectType={MartianColorSelect.MARTIAN_COLOR_SELECT_TYPE.MULTI_SELECT} answers={this.props.answers} question={question} onSubmit={(selectedElements) => this.finalizeMartianColorSelect(question, selectedElements)}/>
        )
    }


    finalizeMartianColor = (question, answer) => {
        this.state.answers.push(answer);

        let object = {
            storeAs: question.storeAs,
            answer: this.state.answers
        }

        this.resetState();
        this.props.onSubmit(object);
    }


    finalizeMartianColorSelect = (question, selectedElements) => {
        let object = {
            storeAs: question.storeAs,
            answer: selectedElements
        }

        this.resetState();
        this.props.onSubmit(object);
    }

    finalizeSeasonTypeQuestion = (question, answer) => {
        this.state.answers.push(answer);

        let object = {
            storeAs: question.storeAs,
            answer: this.state.answers
        }

        this.resetState();
        this.props.onSubmit(object);
    }

    finalizeStandardQuestion = (question, answer) => {
        this.state.answers.push(answer);

        let object = {
            storeAs: question.storeAs,
            answer: this.state.answers
        }

        this.resetState();
        this.props.onSubmit(object);
    }

    finalizeSkinToneQuestion = (question, answer) => {
        this.state.answers.push(answer);

        let object = {
            storeAs: question.storeAs,
            answer: this.state.answers
        }

        this.props.onSubmit(object);

        this.resetState();
    }

    //-------------------------------------------------------------------------
    // Convenience method(s)

    /**
     * Bereited die View für die Hautton-Spezialisierung vor.
     * @param answerObject
     */
    showSkinToneSpecialisation = (answerObject) => {
        this.state.answers.push(answerObject.value);
        this.state.modalElements = answerObject.options;
        this.state.showModal = true;

        this.setState(this.state);
    }

    /**
     * Setzt den State zurück.
     */
    resetState = () => {
        this.initializeState();
        this.setState(this.state);
    }

    /**
     * Schließt den modalen Dialog
     * @param setState
     */
    closeModal = (setState) => {
        this.state.showModal = false;

        if(setState) {
            this.setState(this.state);
        }
    }

    /**
     * Behandlet den Fall des Back-Button-Press
     */
    handleBackButtonPress = () => {
        this.state.showModal = false;
        this.state.answers.pop();
        this.setState(this.state);
    }

    /**
     * Erstellt aus den übergebenen Farben passende Objekte für das UI
     * @param colors
     * @returns {[]}
     */
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

    /**
     * Erstellt aus einen Hex-Wert ein Objekt, welches Styling-Informationen beinhaltet. Diese werden im UI für die
     * einzelnen auswählbaren Farbflächen benutzt.
     *
     * @param colorHex
     * @returns {{squareStyle: {backgroundColor}, hex, textStyle: {color: (string)}}}
     */
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

    /**
     * Generiert den Inhalt des modalen Dialogs anhand des übergebenen selectedItems
     * @param selectedItem
     */
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

    /**
     * Gibt den passenden Titel für den Fragetypen zurück.
     * @param value: Titel der Frage
     * @returns {*}
     */
    getTitleForModal = (value) => {
        let type = this.props.question.type.toUpperCase();
        let modalTitle = this.props.question.modalTitle;

        switch (type) {
            case "MARTIAN_COLOR":
            case "MARTIAN_COLOR_MULTI_SELECT":
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
}