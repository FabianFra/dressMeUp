import React, {Component} from "react";
import {FlatList, Modal, Text, TouchableOpacity, View} from "react-native";
import GlobalStyle from "../js/GlobalStyle";

import MartianColorHandler from "../../../FabscheAlgorithmus/src/scripts/MartianColorHandler";
import TinyColor from "../../../FabscheAlgorithmus/frameworks/TinyColor/tinycolor";
import HelperTool from "../../../FabscheAlgorithmus/src/scripts/Helpertool";

/*
 * Die Klasse beinhaltet die generischen Views für die Selektion einer Farbe. Die beinhalteten Komponenten werden
 * für jede View benutzt, welche dem Anwender bittet eine Farbe auszuwählen.
 */
export default class MartianColorSelect extends Component {

    //-------------------------------------------------------------------------
    // Constructor(s)

    constructor(props) {
        super(props);
        this.initializeState();
    }

    componentDidMount() {
        this.setState(this.state);
    }

    initializeState() {
        this.state = {
            colorHandler: new MartianColorHandler(),
            styles: this.createStylesheet(),

            question: this.props.question,
            showModal: false,
            selectedItems: []
        }
    }

    render() {
        switch (this.props.martianColorSelectType) {
            case MartianColorSelect.MARTIAN_COLOR_SELECT_TYPE.NORMAL:
                return this.generateMartianColorsQuestion();
            case MartianColorSelect.MARTIAN_COLOR_SELECT_TYPE.MULTI_SELECT:
                return this.generateMartianColorsMultiSelectQuestion();
        }

    }

    //-------------------------------------------------------------------------
    // Enumerations

    static get MARTIAN_COLOR_SELECT_TYPE() {
        return {
            NORMAL: 0,
            MULTI_SELECT: 1
        }
    }

    //-------------------------------------------------------------------------
    // Generator(s)

    /**
     * Die Methode beinhaltet die UI-Elemente für die Auswahl einer Farbe des Martian-Color-Wheel
     * @returns {JSX.Element}
     */
    generateMartianColorsQuestion = () => {
        let colorsWithText = this.getColorsWithText(this.state.colorHandler.getAllAchromaticColors(true).concat(this.state.colorHandler.getAllRepresentativeColors()));

        return (
            <View style={GlobalStyle.commonAllContainer}>
                <View style={{paddingTop: 10}}>
                    <Text style={GlobalStyle.commonTitle}>{this.props.question.title}</Text>
                </View>
                <View style={GlobalStyle.colorContainer}>
                    <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={{alignItems: 'center', padding: 10}}
                              data={colorsWithText} numColumns={2} renderItem={ itemData =>
                        <TouchableOpacity onPress={() => this.state.colorHandler.isAchromaticColor(itemData.item.hex) ? this.finalizeMartianColorSelect(itemData.item.hex) : this.getColorSpecifications(itemData.item.originalInput)} style={ [GlobalStyle.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow] }>
                            <View style={GlobalStyle.colorSquareContentContainer}>
                                <Text style={[GlobalStyle.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }>
                    </FlatList>
                </View>

                <Modal visible={this.state.showModal} animationType={'fade'} onRequestClose={() => this.closeModal(true) }>
                    <View style={[GlobalStyle.commonAllContainer, GlobalStyle.colorContainer]}>
                        <View style={{paddingTop: 10}}>
                            <Text style={GlobalStyle.commonTitle}>{this.state.modalTitle}</Text>
                        </View>
                        <FlatList keyExtractor={(item, index) => item.hex} numColumns={2} data={this.state.colorSpecifications}
                                  contentContainerStyle={GlobalStyle.colorContainer} renderItem={itemData =>
                            <TouchableOpacity style={[GlobalStyle.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]} onPress={() => { this.finalizeMartianColorSelect(itemData.item.hex) }}>
                                <View style={GlobalStyle.colorSquareContentContainer}>
                                    <Text style={[GlobalStyle.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                                </View>
                            </TouchableOpacity>}>
                        </FlatList>
                        <TouchableOpacity style={[GlobalStyle.commonButtonAngled, GlobalStyle.submitButton]} onPress={() => { this.closeModal(true); } }>
                            <Text style={GlobalStyle.commonText}>Zurück</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }

    /**
     * Die Methode beinhaltet die UI-Elemente für die Auswahl einer oder mehrerer Farbe(n) des Martian-Color-Wheel
     * @returns {JSX.Element}
     */
    generateMartianColorsMultiSelectQuestion = () => {
        let colorsWithText = this.getColorsWithText(this.state.colorHandler.getAllAchromaticColors(true).concat(this.state.colorHandler.getAllRepresentativeColors()));

        return (
            <View style={GlobalStyle.commonAllContainer}>
                <View style={{paddingTop: 10}}>
                    <Text style={GlobalStyle.commonTitle}>{this.props.question.title}</Text>
                </View>
                <View style={GlobalStyle.colorContainer}>
                    <FlatList keyExtractor={(item, index) => item.hex} contentContainerStyle={{alignItems: 'center', padding: 10}}
                              data={colorsWithText} numColumns={2} renderItem={ itemData =>
                        <TouchableOpacity disabled={this.representativeItemIsDisabled(itemData.item.hex)}
                                          onPress={ () => this.getColorSpecifications(itemData.item.originalInput) } style={ [this.getStyleClassForMultiSelect(itemData, true), this.representativeItemIsDisabledStyleClass(itemData.item.hex)] }
                                          onLongPress={ () => this.handleLongPressEvent(itemData.item.hex)}>
                            <View style={GlobalStyle.colorSquareContentContainer}>
                                <Text style={[GlobalStyle.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }>
                    </FlatList>
                    <TouchableOpacity style={[GlobalStyle.commonButtonAngled, GlobalStyle.submitButton]} onPress={() => { this.finalizeMartianColorSelect(this.state.selectedItems) } }>
                        <Text style={GlobalStyle.commonText}>Bestätigen</Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={this.state.showModal} animationType={'fade'} onRequestClose={() => this.closeModal(true) }>
                    <View style={[GlobalStyle.commonAllContainer, GlobalStyle.colorContainer]}>
                        <View style={{paddingTop: 10}}>
                            <Text style={GlobalStyle.commonTitle}>{this.state.modalTitle}</Text>
                        </View>
                        <FlatList keyExtractor={(item, index) => item.hex} numColumns={2} data={this.state.colorSpecifications}
                                  contentContainerStyle={GlobalStyle.colorContainer} renderItem={itemData =>
                            <TouchableOpacity disabled={this.itemIsDisabled(itemData.item.hex)} style={[this.getStyleClassForMultiSelect(itemData), this.itemIsDisabledStyleClass(itemData.item.hex)]} onPress={() => { this.handleSelectedElements(itemData.item.hex) }}>
                                <View style={GlobalStyle.colorSquareContentContainer}>
                                    <Text style={[GlobalStyle.colorSquareText, itemData.item.textStyle]}>{itemData.item.originalInput.name}</Text>
                                </View>
                            </TouchableOpacity>}>
                        </FlatList>
                        <TouchableOpacity style={[GlobalStyle.commonButtonAngled, GlobalStyle.submitButton]} onPress={() => { this.closeModal(true); } }>
                            <Text style={GlobalStyle.commonText}>Bestätigen</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }

    /**
     * Funktion, welche beim submit einer Antwort ausgeführt wird. Sie reinitialisiert den state (rerender der View).
     * @param answer
     */
    finalizeMartianColorSelect(answer) {
        console.log("finalizeMartianColorSelect: " + answer);
        this.props.onSubmit(answer);
        this.initializeState();
        this.setState(this.state);
    }

    //-------------------------------------------------------------------------
    // Convenience method(s)

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
     * Gibt die Spezifikationen der übergebenen Farbe zurück (specifications, monochromaticColors) und öffnet den modalen
     * Dialog (rerender der View).
     *
     * Es werden die Objekte der specifications zurückgebenen, falls die übergebene Farbe eine achromatische Farbe ist.
     * Es werden die monochromatischen Farbobjekte zurückgegeben, falls die übergebene Farbe eine nich achromatische Farbe
     * ist.
     *
     * @see MartianColorWheelData.js
     * @param color: Farbobjekt
     */
    getColorSpecifications = (color) => {
        let colorSpecifications = undefined;

        if(this.state.colorHandler.isAchromaticColor(color.hex)) {
            this.handleSelectedElements(color.hex)
        } else {
            if(color.specifications) {
                colorSpecifications = color.specifications;
            } else {
                let monochromaticColors = this.state.colorHandler.getMonochromaticColors(color);
                colorSpecifications = [monochromaticColors[1], monochromaticColors[4], monochromaticColors[0], monochromaticColors[3], monochromaticColors[2]];
            }

            this.state.colorSpecifications = this.getColorsWithText(colorSpecifications);
            this.state.modalTitle = this.getTitleForModal(color.name);
            this.state.showModal = true;
            this.setState(this.state);
        }
    }

    /**
     * Gibt die Style-KLassen für eine Multi-Select-Element zurück.
     *
     * @param itemData
     * @param childSelected
     * @returns {[*, {backgroundColor: *}|{backgroundColor: *}|{backgroundColor: *}|*, *]}
     */
    getStyleClassForMultiSelect = (itemData, childSelected) => {
        let style = [GlobalStyle.colorSquare, itemData.item.squareStyle, GlobalStyle.commonShadow]

        let itemHex = itemData.item.hex;

        if(childSelected && !this.state.colorHandler.isAchromaticColor(itemHex)) {
            if(HelperTool.isInArray(itemHex, this.state.selectedItems)) {
                style.push(this.state.styles.selectedElement);
            } else {
                let monochromaticColors = this.state.colorHandler.getMonochromaticColors(this.state.colorHandler.findColorByHex(itemHex), "hex");
                let hasChild = false;

                for(let i = 0; i < monochromaticColors.length; i++) {
                    let monochromaticColor = monochromaticColors[i];

                    if(itemHex !== monochromaticColor && HelperTool.isInArray(monochromaticColors[i], this.state.selectedItems)) {
                        hasChild = true;
                        break;
                    }
                }

                if(hasChild) {
                    style.push(this.state.styles.hasSelectedChild);
                }
            }
        } else {
            let exists = this.itemIsDisabled(itemHex);

            if(!exists) {
                style.push(HelperTool.isInArray(itemHex, this.state.selectedItems) ? this.state.styles.selectedElement : '');
            }
        }

        return style;
    }

    /**
     * Gibt die Style-Klasse für ein deaktiviertes Item zurück, falls die representative Farbe der Farbfamilie von dem
     * übergebenen Hex-Wert deaktiviert ist.
     * @param hex
     * @returns {string}
     */
    representativeItemIsDisabledStyleClass = (hex) => {
        let styleClass = '';

        if(this.representativeItemIsDisabled(hex)) {
            styleClass = GlobalStyle.disabled;
        }

        return styleClass;
    }

    /**
     * Überprüft, ob die repräsentative Farbe von der Farbfamilie des übergebenen Hex-Wertes deaktiviert ist.
     * @param hex
     * @returns {boolean}
     */
    representativeItemIsDisabled = (hex) => {
        let isDisabled = true;

        if(this.state.colorHandler.isAchromaticColor(hex)) {
            isDisabled = this.itemIsDisabled(hex);
        } else {
            let monochromaticColors = this.state.colorHandler.getMonochromaticColors(this.state.colorHandler.findColorByHex(hex), "hex");

            for(let i = 0; i < monochromaticColors.length; i++) {
                let monochromaticColor = monochromaticColors[i];

                if(!this.itemIsDisabled(monochromaticColor)) {
                    isDisabled = false;
                    break;
                }
            }
        }

        return isDisabled;
    }

    /**
     * Gibt die Style-Klasse für ein deaktiviertes Element zurück, falls das korrespondierende Ui-Element des
     * übergebenen Hex-Wertes deaktiviert ist.
     *
     * @param hex
     * @returns {string}
     */
    itemIsDisabledStyleClass = (hex) => {
        let styleClass = '';

        if(this.itemIsDisabled(hex)){
            styleClass = GlobalStyle.disabled;
        }

        return styleClass;
    }

    /**
     * Überprüft, ob die Farbe von der Farbfamilie des übergebenen Hex-Wertes deaktiviert ist.
     * @param hex
     * @returns {boolean}
     */
    itemIsDisabled = (hex) => {
        let itemIsDisabled = false;

        if(HelperTool.isDeclaredAndNotNull(this.props) && HelperTool.isDeclaredAndNotNull(this.props.answers) && !HelperTool.isEmpty(this.props.answers)) {
            let desirableColors = this.props.answers[this.props.answers.length -1]["answer"];

            if(HelperTool.isDeclaredAndNotNull(desirableColors)) {
                itemIsDisabled = HelperTool.isInArray(hex, desirableColors);
            }
        }

        return itemIsDisabled;
    }

    /**
     * Behandelt den Fall einer Änderung der selektierten Elemente.
     *
     * @param key: Id des Elements
     */
    handleSelectedElements = (key) => {
        let selectedItems = this.state.selectedItems;

        if(selectedItems.includes(key)) {
            let index = selectedItems.indexOf(key);
            selectedItems.splice(index, 1);
        } else {
            selectedItems.push(key);
        }

        this.state.selectedItems = selectedItems;
        this.setState(this.state);
    }

    /**
     * Behandelt das long-press Event. Es werden die Farben der Farbfamilie von der selektierten repräsentativen Farbe
     * selektiert/deselektiert.
     * @param key: Id des Elements
     */
    handleLongPressEvent = (key) => {

        if(this.state.colorHandler.isAchromaticColor(key)) {
            this.handleSelectedElements(key);
        } else {
            let martianColor = this.state.colorHandler.findColorByHex(key);
            let monochromaticColors = this.state.colorHandler.getMonochromaticColors(martianColor, "hex");

            let removeItemsFromList = false;
            let selectedItems = this.state.selectedItems;

            for(let i = 0; i < monochromaticColors.length; i++) {
                let monochromaticColor = monochromaticColors[i];

                if(HelperTool.isDeclaredAndNotNull(selectedItems) && !HelperTool.isEmpty(selectedItems)) {
                    if(selectedItems.includes(monochromaticColor)) {
                        removeItemsFromList = true;
                        break;
                    }
                }
            }

            if(removeItemsFromList) {
                this.state.selectedItems = selectedItems.filter((color) => !HelperTool.isInArray(color, monochromaticColors));
            } else {
                if(HelperTool.isDeclaredAndNotNull(this.props) && HelperTool.isDeclaredAndNotNull(this.props.answers) && !HelperTool.isEmpty(this.props.answers)) {
                    let desirableColors = this.props.answers[this.props.answers.length -1]["answer"];
                    let filteredMonochromaticColors = monochromaticColors.filter((color) => !HelperTool.isInArray(color, desirableColors));
                    this.state.selectedItems = selectedItems.concat(filteredMonochromaticColors);
                } else {
                    this.state.selectedItems = selectedItems.concat(monochromaticColors);
                }
            }


            this.setState(this.state);
        }
    }

    /**
     * Gibt den Titel für den modalen Dialog zurücl
     *
     * @param value: Text
     * @returns {*}
     */
    getTitleForModal = (value) => {
        let modalTitle = this.props.question.modalTitle;

        if(typeof modalTitle === "undefined") {
            modalTitle = this.props.question.title;
        } else {
            modalTitle = modalTitle.replace("%s", value);
        }

        return modalTitle
    }

    /**
     * Schließt den modalen Dialog
     * @param setState: boolean, ob die View rerendert werden soll
     */
    closeModal = (setState) => {
        this.state.showModal = false;

        if(setState) {
            this.setState(this.state);
        }
    }

    /**
     * Beinhaltet die in der Klasse genutzten styling Informationen der UI-Elemente.
     * @returns {{hasSelectedChild: {borderColor: string, borderRadius: number, borderWidth: number, borderStyle: string}, selectedElement: {borderColor: string, borderWidth: number}}}
     */
    createStylesheet = () => {
        return {
            selectedElement: {
                borderWidth: 2,
                borderColor: "#ffffff"
            },

            hasSelectedChild: {
                borderWidth: 2,
                borderRadius: 1,
                borderColor: "#ffffff",
                borderStyle: "dashed"
            },
        }
    }
}