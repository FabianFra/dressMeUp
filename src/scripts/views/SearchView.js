import React, {Component} from "react";
import {BackHandler} from "react-native-web";
import * as RootNavigation from "../js/RootNavigation";
import {FlatList, Image, Modal, Text, TouchableOpacity, View} from "react-native";
import GlobalStyle from "../js/GlobalStyle";
import QuestionHandler from "../components/QuestionHandler";

import SearchForTop from "../../../FranksAlgorithmus/src/scripts/ffr_searchForTop";
import TinyColor from "../frameworks/TinyColor/tinycolor";
import ColorHandler from "../../../FranksAlgorithmus/src/scripts/martianColor";

export default class CreateUserView extends Component {
    constructor(props) {
        super(props);
        this.state = { showQuestions: true, showResults: false, martianColorHandler: new ColorHandler() };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress)
    }

    onBackButtonPress = () => {
        RootNavigation.navigate("SearchMenu");
    }

    evaluateAnswers = (answers) => {
        this.state.showQuestions = false;
        this.state.showResults = true;

        if(!HelperTool.isDeclared(answers["preferLightColors"])) {
            answers["preferLightColors"] = null;
        }

        if(!HelperTool.isDeclared(answers["preferSaturatedColors"])) {
            answers["preferSaturatedColors"] = null;
        }

        console.log("answerser: ", answers);
        //console.log(global.currentUser);

        this.state.result = new SearchForTop(answers, global.currentUser).resultObject;

        this.setState(this.state);
    }

    render = () => {
        const questions = [
            { id: "0", title: 'Möchtest du auffallen?', type: 'STANDARD_DYNAMIC', options: [{"key": "Ja", "value": false}, {"key": "Nein", "value": true}], storeAs: "wantToStandOut"},
            { id: "1", title: 'Möchtest du deine Augen hervorstechen lassen?', type: 'STANDARD_DYNAMIC', options: [{"key": "Ja", "value": false}, {"key": "Nein", "value": true}, {"key": "Mir egal", "value": null}], storeAs: "focusEyeColor"},
            { id: "2", title: 'Gesättige- oder Grelle Farben?', type: 'STANDARD_DYNAMIC', options: [{"key": "Gesättigte Farben", "value": true}, {"key": "Grelle Farben", "value": false}, {"key": "Mir egal", "value": null}], storeAs: "preferSaturatedColors", isConditional: true},
            { id: "3", title: 'Magst du eher helle- oder dunkle Farben?', type: 'STANDARD_DYNAMIC', options: [{"key": "Helle Farben", "value": false}, {"key": "Dunkle Farben", "value": true}, {"key": "Mir egal", "value": null}], storeAs: "preferLightColors", skipWhen: [true, false]},
            { id: "4", title: 'Welche Farbe haben deine Schuhe?', type: 'MARTIAN_COLOR', storeAs: "shoes"},
            { id: "5", title: 'Welche Farbe hat deine Hose?', type: 'MARTIAN_COLOR', storeAs: "trousers"},
            { id: "6", title: 'Trägst du eine Jacke?', type: 'STANDARD_DYNAMIC', options: [{"key": "Ja", "value": true}, {"key": "Nein", "value": false}], isConditional: true},
            { id: "7", title: 'Welche Farbe hat deine Jacke?', type: 'MARTIAN_COLOR', storeAs: "jacket", skipWhen: false},
        ];

        let result = []

        if(this.state.showResults) {
            result = this.getColorsWithText(this.state.result);
        }

        return (
            <View>
                <QuestionHandler questions={questions} showQuestions={this.state.showQuestions} onComplete={(answers) => {this.evaluateAnswers(answers)}} onReturn={this.onBackButtonPress}/>

                <Modal visible={this.state.showResults} animationType={'fade'} onRequestClose={() => this.props.onBack()}>
                    <View style={GlobalStyle.commonAllContainer}>
                        <View style={{paddingTop: 10}}>
                            <Text style={GlobalStyle.commonTitle}>Diese Farben kannst du tragen</Text>
                        </View>
                        <View style={GlobalStyle.colorContainer}>
                            <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={{alignItems: 'center', padding: 10}}
                                      data={result} numColumns={2} renderItem={ itemData =>
                                <TouchableOpacity disabled={true} style={[GlobalStyle.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]}>
                                    <View style={GlobalStyle.colorSquareContentContainer}>
                                        <Text style={[GlobalStyle.colorSquareText, itemData.item.textStyle]}>{itemData.item.fieldName}</Text>
                                    </View>
                                </TouchableOpacity>
                            }>
                            </FlatList>
                            <TouchableOpacity style={[GlobalStyle.commonButtonAngled, GlobalStyle.submitButton]} onPress={() => this.props.onBack()}>
                                <Text style={GlobalStyle.commonText}>Zum Startmenü</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

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
        let colorTinyObject, textColor, martianColor;

        colorTinyObject = TinyColor(colorHex);
        textColor = colorTinyObject.isDark() ? "white" : "black";
        martianColor = this.state.martianColorHandler.findColorByHex(colorHex);

        return {
            hex: colorHex,
            fieldName: HelperTool.isDeclaredAndNotNull(martianColor) ? martianColor.name : "n/a",

            squareStyle: {
                backgroundColor: colorHex
            },

            textStyle: {
                color: textColor
            }
        }
    }
}