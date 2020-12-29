import MartianColorWheelData from "../resources/MartianColorWheelData.js";

import HelperTool from "./Helpertool.js";
import LoggingTool from "./LoggingTool.js";
import TinyColor from "../../frameworks/TinyColor/tinycolor.js";

/*
 * Die Klasse bietet Funktionen zum Arbeiten mit dem Martian Color Wheel
 */
export default class MartianColorHandler {
    martianColors = {};
    achromaticColors = [];
    hues = [];

    hsvExtractor = /\d+/g;

    //-------------------------------------------------------------------------
    // Constructor(s)

    constructor() {
        this.martianColors = MartianColorWheelData.martianColors;
        this.achromaticColors = MartianColorWheelData.achromaticColors;
        this.hues = Object.keys(this.martianColors);
    }

    //----------------------------------------------------------------------------------------------------------
    // Constants

    /**
     *
     * Neutrale Farben
     *
     * Schwarz, Weiß, Grau, Dunkelgrau, Hellgrau, Dunkelblau/Navy, Dark Royal Blue
     */
    static get NEUTRAL_COLORS() {
        return [
            "#000000",
            "#ffffff",
            "#808080",
            "#293133",
            "#a6a6a6",
            "#00007a",
            "#002c66",
        ];
    }

    //----------------------------------------------------------------------------------------------------------
    // Getter/Setter

    /**
     * Gibt alle Farbobjekte des Martian Color Wheels zurück.
     *
     * @returns {{}}
     */
    getMartianColors() {
        return this.martianColors;
    }

    /**
     * Gibt alle achromatischen Farbobjekte zurück.
     *
     * @returns {[]}
     */
    getAchromaticColors() {
        return this.achromaticColors;
    }

    /**
     * Gibt eine Menge der Farbtonwerte zurück.
     *
     * @returns {[]}
     */
    getHues() {
        return this.hues;
    }

    //----------------------------------------------------------------------------------------------------------
    // Functions for generating color schemes

    /**
     * Gibt die Komplementärfarbe zurück.
     *
     * @see (https://themen.rainbowprint.de/komplementaerfarben/)
     * @param color: Objekt, welches die Farbe darstellt
     * @param mapByProperty: Mapping des Endobjekts (hex, rgb, hsv)
     * @returns {*}
     */
    getComplementColor(color, mapByProperty) {
        let complement = undefined;

        let wheelPosition = this.getColorWheelPosition(color);
        let complementColorObj = this.getNextColorObjBySteps(wheelPosition, 12);

        if (typeof complementColorObj !== "undefined") {
            let foundColor = this.getMatchingColorInColorObj(color, complementColorObj)

            complement = foundColor;
        }

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
                complement = complement[mapByProperty];
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }

        return complement;
    }

    /**
     * Gibt die analogen Farben zurück.
     *
     * @see (https://www.hisour.com/de/analogous-colors-26161/)
     * @param color: Objekt,
     * @param fullAnalogues: boolean, ob das vollständige analoge Farbschema angewendet werden
     * @param mapByProperty: Mapping des Endobjekts (hex, rgb, hsv)
     * @returns {[]}
     */
    getAnalogousColors(color, fullAnalogues, mapByProperty) {
        let analogous = [];

        let wheelPosition = this.getColorWheelPosition(color);
        analogous.push(color);

        for (let i = 0; i <= 1; i++) {
            let analogousColorObj = this.getNextColorObjBySteps(wheelPosition, (i === 0 ? 1 : -1));

            if (typeof analogousColorObj !== "undefined") {
                let foundColor = this.getMatchingColorInColorObj(color, analogousColorObj)

                analogous.push(foundColor);
            }

            if (fullAnalogues) {
                analogousColorObj = this.getNextColorObjBySteps(wheelPosition, (i === 0 ? 2 : -2))

                if (typeof analogousColorObj !== "undefined") {
                    let foundColor = this.getMatchingColorInColorObj(color, analogousColorObj)

                    analogous.push(foundColor);
                }
            }
        }

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(analogous[0][mapByProperty])) {
                analogous = analogous.map(analogColor => { return analogColor[mapByProperty] });
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }

        return analogous;
    }

    /**
     * Gibt die triadische Farben zurück.
     *
     * @see (https://kulturbanause.de/faq/triadisches-farbschema/)
     * @param color: Objekt, welches die Farbe darstellt
     * @param mapByProperty: Mapping des Endobjekts (hex, rgb, hsv)
     * @returns {*}
     */
    getTriadColors(color, mapByProperty) {
        let triads = [];

        let wheelPosition = this.getColorWheelPosition(color);
        triads.push(color);

        for (let i = 1; i <= 2; i++) {
            let triadColorObj = this.getNextColorObjBySteps(wheelPosition, 8 * i);

            if (typeof triadColorObj !== "undefined") {
                let foundColor = this.getMatchingColorInColorObj(color, triadColorObj)

                triads.push(foundColor);
            }
        }

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(triads[0][mapByProperty])) {
                triads = triads.map(triadColor => { return triadColor[mapByProperty] });
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }

        return triads;
    }

    /**
     * Gibt die monochromatischen Farben zurück.
     *
     * @see (https://www.hisour.com/de/monochromatic-color-26157/)
     * @param color: Objekt, welches die Farbe darstellt
     * @param mapByProperty: Mapping des Endobjekts (hex, rgb, hsv)
     * @param shouldBeLight: boolean, ob nur  die hellen Farben zurückgegeben werden sollen
     * @returns {*}
     */
    getMonochromaticColors(color, mapByProperty, shouldBeLight) {
        let monochromaticColors = undefined;

        let hue = this.getHueOfColor(color, false);
        let monochromaticColorObj = this.getColorObjByHue(hue);

        if (typeof monochromaticColorObj !== "undefined") {
            monochromaticColors = this.getColorsByColorObj(monochromaticColorObj);
        }

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(monochromaticColors[0][mapByProperty])) {
                monochromaticColors = monochromaticColors.map(monochromaticColor => { return monochromaticColor[mapByProperty] });

                if(HelperTool.isDeclaredAndNotNull(shouldBeLight)) {
                    monochromaticColors = monochromaticColors.filter(monochromaticColor => {
                        return shouldBeLight && this.isLightColor(monochromaticColor);
                    });
                }
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }

        return monochromaticColors;
    }

    /**
     * Gibt die tetradrische Farben zurück.
     *
     * @see (https://kulturbanause.de/faq/tetradisches-farbschema)
     * @param color: Objekt, welches die Farbe darstellt
     * @param mapByProperty: Mapping des Endobjekts (hex, rgb, hsv)
     * @returns {*}
     */
    getTetradColors(color, mapByProperty) {
        let tetrad = [];

        let wheelPosition = this.getColorWheelPosition(color);
        tetrad.push(color);

        let nextColorObj = this.getNextColorObjBySteps(wheelPosition, 1);

        if (typeof nextColorObj !== "undefined") {
            let foundColor = this.getMatchingColorInColorObj(color, nextColorObj)

            tetrad.push(foundColor);
            tetrad.push(this.getComplementColor(color));
            tetrad.push(this.getComplementColor(foundColor))
        }

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(tetrad[0][mapByProperty])) {
                tetrad = tetrad.map(tetradColor => { return tetradColor[mapByProperty] });
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }


        return tetrad;
    }

    /**
     * Gibt die teil-komplementären Farben zurück.
     *
     * @see (https://www.brandit4.com/de/werbeartikel-glossar/komplementaer-gespittetes-farbschema.html)
     * @param color: Objekt, welches die Farbe darstellt
     * @param mapByProperty: Mapping des Endobjekts (hex, rgb, hsv)
     * @returns {*}
     */
    getSplitComplementaryColors(color, mapByProperty) {
        let splitComplement = [];

        let wheelPosition = this.getColorWheelPosition(color);
        let steps = 11;

        //splitComplement.push(color); TODO Check if it will be add to the list

        for (let i = 0; i <= 1; i++) {
            let nextColorObj = this.getNextColorObjBySteps(wheelPosition, steps);

            if (typeof nextColorObj !== "undefined") {
                let foundColor = this.getMatchingColorInColorObj(color, nextColorObj)

                splitComplement.push(foundColor);
            }

            steps += 2;
        }

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(splitComplement[0][mapByProperty])) {
                splitComplement = splitComplement.map(splitComplementColor => { return splitComplementColor[mapByProperty] });
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }

        return splitComplement;
    }

    /**
     * Gibt die tetradrische Farben zurück. Im Vergleich zu getTetradColors, sind die Farben
     * über das gesamte Farbrad gleich verteilt.
     *
     * @see (https://www.tigercolor.com/color-lab/color-theory/color-harmonies.htm)
     * @param color: Objekt, welches die Farbe darstellt
     * @param mapByProperty: Mapping des Endobjekts (hex, rgb, hsv)
     * @returns {*}
     */
    getSquareColors(color, mapByProperty) {
        let squareColors = [];

        let wheelPosition = this.getColorWheelPosition(color);
        let steps = 6;

        squareColors.push(color);

        for (let i = 0; i <= 2; i++) {
            let nextColorObj = this.getNextColorObjBySteps(wheelPosition, steps);

            if (typeof nextColorObj !== "undefined") {
                let foundColor = this.getMatchingColorInColorObj(color, nextColorObj)

                squareColors.push(foundColor);
            }

            steps += 6;
        }

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(squareColors[0][mapByProperty])) {
                squareColors = squareColors.map(squareColor => { return squareColor[mapByProperty] });
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }

        return squareColors;
    }

    //----------------------------------------------------------------------------------------------------------
    // Convenience functions

    /**
     * Überprüft, ob die übergebene Farbe eine neutrale Farbe ist.
     *
     * @param color: Kann ein Farbobjekt oder ein Hex-Wert sein
     */
    isNeutralColor(color) {
        let isNeutralColor = false;

        if(HelperTool.isHex(color)) {
            isNeutralColor = HelperTool.isInArray(color, MartianColorHandler.NEUTRAL_COLORS);
        } else if(HelperTool.isDeclaredAndNotNull(color["hex"])){
            isNeutralColor = HelperTool.isInArray(color.hex, MartianColorHandler.NEUTRAL_COLORS);
        } else {
            LoggingTool.printError(`The passed parameter ${JSON.stringify(color)} isn't a valid object or a hex value`)
        }

        return isNeutralColor;
    }

    /**
     * Überprüft, ob die übergebene Farbe eine achromatische Farbe ist.
     *
     * @param color: Kann ein Farbobjekt oder ein Hex-Wert sein
     */
    isAchromaticColor(color) {
        let isAchromaticColor = false;
        let achromaticColorsHex = this.getAllAchromaticColors(true).map(achromaticColor => { return achromaticColor.hex });

        if(HelperTool.isHex(color)) {
            isAchromaticColor = HelperTool.isInArray(color, achromaticColorsHex);
        } else if(HelperTool.isDeclaredAndNotNull(color)) {
            isAchromaticColor = HelperTool.isInArray(color.hex, achromaticColorsHex);
        } else {
            LoggingTool.printError(`The passed parameter ${JSON.stringify(color)} isn't a valid object or a hex value`)
        }

        return isAchromaticColor;
    }

    /**
     * Gibt ein Farbobjekt anhand des gegebenen Farbtons zurück
     *
     * @param hue: Farbton
     * @returns {*}: Farbobjekt, welches den gegegebenen Farbton besitzt
     */
    getColorObjByHue(hue) {
        return this.getMartianColors()[hue];
    }

    /**
     * Gibt das Farbobjekt zurück, welches den gegebenen index besitzt
     *
     * @param index: Zahlenwert
     */
    getColorObjByIndex(index) {
        let hues = this.getHues();
        let maxIndex = Object.keys(this.martianColors).length - 1;
        let colorObj = undefined;

        if (index <= maxIndex) {
            colorObj = this.getColorObjByHue(hues[index]);
        } else {
            LoggingTool.printWarn(`No element found for index ${index}`);
        }

        return colorObj;
    }

    /**
     * Gibt das Farbobjekt an der übergebenen Position zurück (currentIndex + steps)
     *
     * @param currentIndex: Position des derzeitigen Farbobjekts
     * @param steps: Schritte für die nächste Position
     * @returns {*}
     */
    getNextColorObjBySteps(currentIndex, steps) {
        let hues = this.getHues();
        let nextIndex = currentIndex + steps;
        let maxIndex = Object.keys(hues).length - 1;

        if (nextIndex < 0) {
            nextIndex = (nextIndex + maxIndex) + 1;
        } else if (nextIndex > maxIndex) {
            nextIndex = (nextIndex - maxIndex) - 1;
        }

        return this.getColorObjByIndex(nextIndex);
    }

    /**
     * Gibt alle Farben des gegebenen Farbobjekts zurück
     *
     * @param colorOb: Farbobjekt
     * @returns {*[]}
     */
    getColorsByColorObj(colorObj) {
        return [].concat(colorObj.shades, colorObj.representative, colorObj.tints);
    }

    /**
     * Gibt die passende Farbe in dem übergegebenen Farbobjekt zurück.
     *
     * @param hsvString --> Hsv-Wert
     * @param colorObj --> Farbobjekt
     */
    getMatchingColorInColorObj(color, nextColorObj) {
        let matchingColor = undefined;
        let hue = this.getHueOfColor(color, false);
        let colorObj = this.getColorObjByHue(hue);

        let indexOfColor = this.getColorsByColorObj(colorObj).indexOf(color);

        if(HelperTool.isDeclaredAndNotNull(indexOfColor)) {
            matchingColor = this.getColorsByColorObj(nextColorObj)[indexOfColor];
        }

        return matchingColor;
    }

    /**
     * Teilt den HSV-Wert in seine einzelne Eigenschaften (Farbton, Sättigung, Helligkeit)
     *
     * @param hsv: Hsv-Wert
     * @param asInt: boolean, ob die extrahierten Werte zu einem integer konvertiert werden sollen
     * @returns {*}
     */
    getHsvExtraction(hsv, asInt) {
        let hsvEx = hsv.match(this.hsvExtractor);

        if(asInt) {
            hsvEx = hsvEx.map((value) => {
                return parseInt(value);
            })
        }

        return hsvEx;
    }

    /**
     * Gibt alle verfügbaren Farben zurück.
     *
     * @param includeAchromatic: boolean, ob die achromatischen Farben inkludiert werden sollen
     * @returns {[]}
     */
    getAllColors(includeAchromatic) {
        let colors = [];
        let hues = this.getHues();
        let martianColors = this.getMartianColors();

        hues.forEach(hue => {
            let hueColors = this.getColorsByColorObj(martianColors[hue]);

            colors = colors.concat(hueColors);
        })

        if (includeAchromatic) {
            colors = colors.concat(this.getAllAchromaticColors(true));
        }

        return colors;
    }

    /**
     * Gibt alle verfügbaren achromatischen Farben zurück.
     *
     * @param addSpecifications: boolean, ob die Spezifikationen inkludiert werden sollen
     * @returns {[]}
     */
    getAllAchromaticColors(addSpecifications) {
        let achromaticColors = this.getAchromaticColors();
        let colors = [];

        achromaticColors.forEach(color => {
            colors.push(color);

            if (addSpecifications && HelperTool.isDeclaredAndNotNull(color["specifications"])) {
                colors = colors.concat(color["specifications"]);
            }
        })

        return colors;
    }

    /**
     * Gibt alle verfügbaren representativen Farben zurück.
     *
     * @returns {[]}
     */
    getAllRepresentativeColors() {
        let martianColors = this.getMartianColors();
        let representatives = [];

        for (let color of Object.values(martianColors)) {
            representatives = representatives.concat(color.representative);
        }

        return representatives;
    }

    /**
     * Gibt alle verfügbaren warmen Farben zurück.
     *
     * @returns {[]}
     */
    getWarmColors() {
        let allColors = this.getAllColors();
        let warmColors = [];

        allColors.forEach(color => {
            let hue = this.getHueOfColor(color, true)

            if (hue < 120 || hue >= 333) {
                warmColors.push(color);
            }
        })

        return warmColors;
    }

    /**
     * Gibt alle verfügbaren kalten Farben zurück.
     *
     * @returns {[]}
     */
    getColdColors() {
        let allColors = this.getAllColors();
        let coldColors = [];

        allColors.forEach(color => {
            let hue = this.getHueOfColor(color, true);

            if (hue < 333 && hue >= 120) {
                coldColors.push(color);
            }
        })

        return coldColors;
    }

    /**
     * Gibt den H-Wert des Farobjekts zurück.
     *
     * @param color: Farbobjekt
     * @param asInt: boolean, ob der H-Wert in ein integer konvertiert werden soll
     *
     * @returns {null}
     */
    getHueOfColor(color, asInt) {
        let hsvExtraction = this.getHsvExtraction(color.hsv, asInt);
        let saturation = null;

        if(hsvExtraction.length === 3) {
            saturation = hsvExtraction[0];
        }

        return saturation;
    }

    /**
     * Gibt den Sättigungs-Wert des Farobjekts zurück.
     *
     * @param color: Farbobjekt
     * @param asInt: boolean, ob der Sättigungs-Wert in ein integer konvertiert werden soll
     *
     * @returns {null}
     */
    getSaturationOfColor(color, asInt) {
        let hsvExtraction = this.getHsvExtraction(color.hsv, asInt);
        let saturation = null;

        if(hsvExtraction.length === 3) {
            saturation = hsvExtraction[1];
        }

        return saturation;
    }

    /**
     * Gibt den V-Wert des Farobjekts zurück.
     *
     * @param color: Farbobjekt
     * @param asInt: boolean, ob der V-Wert in ein integer konvertiert werden soll
     *
     * @returns {null}
     */
    getValueOfColor(color, asInt) {
        let hsvExtraction = this.getHsvExtraction(color.hsv, asInt);
        let value = null;

        if(hsvExtraction.length === 3) {
            value = hsvExtraction[2];
        }

        return value;
    }


    /**
     * Sucht die Farbe anhand des übergebenen Hsv-Strings.
     *
     * @param colorHsv
     */
    findColorByHsvStr(colorHsv) {
        let extractValues = colorHsv.match(this.hsvExtractor);

        if (extractValues === null || extractValues.length !== 3) {
            LoggingTool.printWarn(`Incorrect hsv format, nothing found for ${colorHsv}`)
            return undefined;
        }

        let hue = extractValues[0];
        let saturation = extractValues[1];
        let intensity = extractValues[2];

        return this.findColorByHsv(`hsv(${hue}, ${saturation}%, ${intensity}%)`);
    }

    /**
     * Gibt die Farbe zurück, welche den übergebenen HSV-Wert besitzt.
     *
     * @param hsvString: Hsv-String, erwartet folgendes Format: 'hsv(digit, digit, digit)'
     */
    findColorByHsv(hsvString) {
        return this.findColorByPropertyValue("hsv", hsvString);
    }

    /**
     * Gibt die Farbe zurück, welche den übergebenen HEX-Wert besitzt.
     *
     * @param hexString: Hex-String
     */
    findColorByHex(hexString) {
        let martianColor = null;

        if(HelperTool.isHex(hexString)) {
            martianColor = this.findColorByPropertyValue("hex", hexString);
        } else {
            LoggingTool.printWarn("findColorByHex: Passed parameter hasn't the right hex format");
        }

        return martianColor;
    }

    /**
     * Gibt die Farbe zurück, welche den übergebenen Namen besitzt.
     *
     * @param colorName: Name der gesuchten Farbe
     */
    findColorByName(colorName) {
        return this.findColorByPropertyValue("name", colorName);
    }

    /**
     * Gibt die Farbe zurück anhand der übergebenen Eigenschaft und dessen Wertes.
     *
     * @param property --> Property, welches untersucht werden soll
     * @param value --> Der Wert, welcher das Objekt als Propety Wert haben soll
     * @returns {*}
     */
    findColorByPropertyValue(property, value) {
        let foundColor = null;

        if(HelperTool.isDeclaredAndNotNull(property) && HelperTool.isDeclaredAndNotNull(value)) {
            let martianColors = this.getAllColors(true);

            value = value.toLowerCase();

            for (let element of martianColors) {
                if (element[property].toLowerCase() === value) {
                    foundColor = element;
                    break;
                }
            }
        }

        if (typeof foundColor === "undefined") {
            LoggingTool.printWarn(`No color found for property ${property}, with value ${value}`);
        }

        return foundColor;
    }

    /**
     * Überprüft, ob die zwei Farbobjekte gleich sind
     *
     * @param colorOne
     * @param colorTwo
     * @returns {boolean|boolean}
     */
    compareColors(colorOne, colorTwo) {
        return colorOne.hex === colorTwo.hex;
    }

    /**
     * Gibt den Farbton der übergebenen Farbe zurück.
     *
     * @param color: Farbobjekt
     * @returns {*|string}
     */
    getColorHue(color) {
        let hsv = color.hsv.match(this.hsvExtractor);

        return hsv[0];
    }

    /**
     * Überpürft, ob die übergebene Farbe dunkel ist.
     *
     * @see(Tinycolor.isDark())
     * @param color
     * @returns {*}
     */
    isDarkColor(color) {
        let isDark;

        if(HelperTool.isHex(color)) {
            isDark = Tinycolor(color).isDark();
        } else if(typeof color["hex"] !== "undefined") {
            isDark = Tinycolor(color.hex).isDark();
        }

        return isDark;
    }

    /**
     * Überpürft, ob die übergebene Farbe hell ist.
     *
     * @see(Tinycolor.isLight())
     * @param color
     * @returns {*}
     */
    isLightColor(color) {
        let isLight;

        if(HelperTool.isHex(color)) {
            isLight = TinyColor(color).isLight();
        } else if(typeof color["hex"] !== "undefined") {
            isLight = TinyColor(color.hex).isLight();
        }

        return isLight;
    }

    /**
     * Gibt die derzeitigen Position/Index der Farbe zurück.
     *
     * @param color
     * @returns {number}
     */
    getColorWheelPosition(color) {
        let hues = this.getHues();
        let hue = this.getColorHue(color);

        return hues.indexOf(hue);
    }

    /**
     * Überprüft, ob die übergebenen Farben monochromatisch sind.
     *
     * @param colors: Array aus Hex oder Objekten, welche ein Hex-Attribute besitzen
     * @returns {boolean}
     */
    colorsAreMonochromatic(colors) {
        colors = colors.map(color => { return HelperTool.isHex(color) ? this.findColorByHex(color) : color });

        let examinedColor = colors[0];
        let monochromaticColors = this.getMonochromaticColors(examinedColor, "hex");
        let areMonochromatic = true;

        colors.forEach(color => {
            if(HelperTool.inArray(color.hex, monochromaticColors) < 0) {
                areMonochromatic = false;
            }
        })

        return areMonochromatic;
    }

    /**
     * Gibt eine Menge von Farben zurück, welche sich in dem gegebenen Bereich befinden.
     *
     * Shades: 0 bis 1
     * Repräsentative Farbe: 2
     * Tints: 3 bis 4
     */
    getColorsByLevel(begin, end, color, mapByProperty) {
        let colors = [];
        let hues = this.getHues();
        let martianColors = this.getMartianColors();

        if(begin > end) {
            LoggingTool.printError(`The 'begin' parameter (${begin}) is greater than the 'end' parameter (${end}), which is prohibited.`)
        }

        if(begin < 0 || end < 0) {
            LoggingTool.printError(`The 'begin' parameter (${begin}) and/or the 'end' parameter (${end}) are negative, which is prohibited.`)
        }

        if(typeof end === "undefined" || end === null) {
            end = 5;
        }

        if(!HelperTool.isDeclaredAndNotNull(color)) {
            hues.forEach(hue => {
                let hueColors = this.getColorsByColorObj(martianColors[hue]);

                colors = colors.concat(hueColors.slice(begin, end + 1));
            })
        } else {
            let hueColor = this.getColorsByColorObj(martianColors[this.getHueOfColor(color, false)]);

            colors = colors.concat(hueColor.slice(begin, end + 1));
        }

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(colors[0][mapByProperty])) {
                colors = colors.map(color => { return color[mapByProperty] });
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }

        return colors;
    }

    /**
     * Gibt die verfügbaren shades zurück.
     *
     * @param color
     * @param includeRepresentative: boolean, ob die representative Farbe mit einbezogen wird
     * @param mapByProperty: Mapping des Endobjekts (hex, rgb, hsv)
     * @returns {[]}
     */
    getShades(color, includeRepresentative, mapByProperty) {
        let colors;

        if(HelperTool.isDeclaredAndNotNull(color)) {
            if(includeRepresentative) {
                colors = this.getColorsByLevel(0, 2, color, mapByProperty)
            } else {
                colors = this.getColorsByLevel(0, 1, color, mapByProperty);
            }
        } else {
            if(includeRepresentative) {
                colors = this.getColorsByLevel(0, 2, null, mapByProperty)
            } else {
                colors = this.getColorsByLevel(0, 1, null, mapByProperty);
            }
        }

        return colors;
    }

    /**
     * Gibt die Tins des Martian Color Wheels zurück.
     *
     * @param color: Farbobjekt, falls nur die Tints der gleichen Farbfamilie gesucht werden
     * @param includeRepresentative: boolean, ob die repräsentative Farbe mit betrachtet werden soll
     * @param mapByProperty: (property) string, in welches format die gefilterten Objekte gemapped werden sollen
     * @returns {[]}
     */
    getTints(color, includeRepresentative, mapByProperty) {
        let colors;

        if(typeof color !== "undefined" && color !== null) {
            if(includeRepresentative) {
                colors = this.getColorsByLevel(2, 4, color, mapByProperty)
            } else {
                colors = this.getColorsByLevel(3, 4, color, mapByProperty);
            }
        } else {
            if(includeRepresentative) {
                colors = this.getColorsByLevel(2, 4, null, mapByProperty)
            } else {
                colors = this.getColorsByLevel(3, 4, null, mapByProperty);
            }
        }

        return colors;
    }

    /**
     * Gibt die hellen achromatischen Farben zurück.
     *
     * @param mapByProperty: (property) string, in welches format die gefilterten Objekte gemapped werden sollen
     * @returns {[]}
     */
    getLightAchromaticColors(mapByProperty) {
        let lightAchromaticColors = [];

        this.getAllAchromaticColors(true).forEach(achromaticColor => {
            if(TinyColor(achromaticColor.hex).isLight()) {
                lightAchromaticColors.push(achromaticColor);
            }
        })

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(lightAchromaticColors[0][mapByProperty])) {
                lightAchromaticColors = lightAchromaticColors.map(color => { return color[mapByProperty] });
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }

        return lightAchromaticColors;
    }

    /**
     * Gibt die dunklen achromatischen Farben zurück.
     *
     * @param mapByProperty: (property) string, in welches format die gefilterten Objekte gemapped werden sollen
     * @returns {[]}
     */
    getDarkAchromaticColors(mapByProperty) {
        let darkAchromaticColors = [];

        this.getAllAchromaticColors(true).forEach(achromaticColor => {
            if(TinyColor(achromaticColor.hex).isDark()) {
                darkAchromaticColors.push(achromaticColor);
            }
        })

        if(HelperTool.isDeclaredAndNotNull(mapByProperty)) {
            if(HelperTool.isDeclaredAndNotNull(darkAchromaticColors[0][mapByProperty])) {
                darkAchromaticColors = darkAchromaticColors.map(color => { return color[mapByProperty] });
            } else {
                LoggingTool.printError(`The passed property for mapping '${mapByProperty}' is invalid / not existing`)
            }
        }

        return darkAchromaticColors;
    }

    /**
     * Gibt alle Hex-Werte der Farben zurück.
     *
     * @param colorArray: Menge an Farbobjekten
     * @returns {[]}
     */
    getHexOfColorArray(colorArray) {
        let martianColors = [];

        if(HelperTool.isIterable(colorArray)) {
            colorArray.forEach(color => {
                if(HelperTool.isDeclaredAndNotNull(color.hex)) {
                    martianColors.push(color.hex);
                } else {
                    LoggingTool.printError(`MartianColorHandler.getHexColorArray: Color doesn't have a property named 'hex', ${color}`);
                }
            })
        }

        return martianColors;
    }

    /**
     * Gibt die übergebene Menge an Farbobjekten in einem lesbaren Format aus.
     *
     * @param colors
     * @returns {[]}
     */
    printColorsByHex(colors) {
        let resultObject = [];

        if(HelperTool.isIterable(colors)) {
            colors.forEach(colorsHex => {
                resultObject.push({
                    name: this.findColorByHex(colorsHex).name,
                    hex: colorsHex
                })
            })
        }

        return resultObject;
    }
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = MartianColorHandler;
} else if(typeof window !== "undefined" && typeof window["martianColorHandler"] === "undefined") {
    window["martianColorHandler"] = new MartianColorHandler();
}