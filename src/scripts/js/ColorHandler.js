import martianColors from '../../resources/data/martianColors.json';

class ColorHandler {
    martianColors = {};
    hues = []

    hsvExtractor = /\d+/g;


    constructor() {
        this.martianColors = martianColors;
        this.hues = Object.keys(this.martianColors);
    }

    //----------------------------------------------------------------------------------------------------------
    //getter/setter

    getMartianColors() {
        return this.martianColors;
    }

    getHues() {
        return this.hues;
    }

    //----------------------------------------------------------------------------------------------------------
    //color schemes

    getComplementColor(color) {
        let complement = undefined;

        let hues = this.getHues();
        let hue = this.getColorHue(color);
        let hueIndex = hues.indexOf(hue.toString());

        let complementColorObj = this.getNextColorObjBySteps(hueIndex, 12);

        if(typeof complementColorObj !== "undefined") {
            let foundColor = this.getMatchingColorInColorObj(color.hsv, complementColorObj)

            complement = foundColor;
        }

        return complement;
    }

    getAnalogousColors(color, fullAnalogues) {
        let analogous = [];

        let hues = this.getHues();
        let hue = this.getColorHue(color);
        let hueIndex = hues.indexOf(hue.toString());

        analogous.push(color);

        for(let i = 0; i <= 1; i++) {
            let analogousColorObj = this.getNextColorObjBySteps(hueIndex, (i === 0 ? 1 : -1));

            if(typeof analogousColorObj !== "undefined") {
                let foundColor = this.getMatchingColorInColorObj(color.hsv, analogousColorObj)

                analogous.push(foundColor);
            }

            if(fullAnalogues) {
                analogousColorObj = this.getNextColorObjBySteps(hueIndex, (i === 0 ? 2 : -2))

                if(typeof analogousColorObj !== "undefined") {
                    let foundColor = this.getMatchingColorInColorObj(color.hsv, analogousColorObj)

                    analogous.push(foundColor);
                }
            }
        }

        return analogous;
    }

    getTriadColors(color) {
        let triads = [];

        let hues = this.getHues();
        let hue = this.getColorHue(color);
        let hueIndex = hues.indexOf(hue.toString());

        triads.push(color);

        for(let i = 1; i <= 2; i++) {
            let triadColorObj = this.getNextColorObjBySteps(hueIndex, 8 * i);

            if(typeof triadColorObj !== "undefined") {
                let foundColor = this.getMatchingColorInColorObj(color.hsv, triadColorObj)

                triads.push(foundColor);
            }
        }

        return triads;
    }

    getMonochromaticColors(color) {
        let monochromaticColors = undefined;

        let hue = this.getColorHue(color);
        let monochromaticColorObj = this.getColorObjByHue(hue);

        if(typeof monochromaticColorObj !== "undefined") {
            monochromaticColors = this.getColorsByColorObj(monochromaticColorObj);
        }

        return monochromaticColors;
    }

    getTetradColors(color) {
        let tetrad = [];

        let hues = this.getHues();
        let hue = this.getColorHue(color);
        let hueIndex = hues.indexOf(hue.toString());

        tetrad.push(color);

        let nextColorObj = this.getNextColorObjBySteps(hueIndex, 1);

        if(typeof nextColorObj !== "undefined") {
            let foundColor = this.getMatchingColorInColorObj(color.hsv, nextColorObj)

            tetrad.push(foundColor);
            tetrad.push(this.getComplementColor(color));
            tetrad.push(this.getComplementColor(foundColor))
        }


        return tetrad;
    }

    getSplitComplementaryColors(color) {
        let splitComplement = [];

        let hues = this.getHues();
        let hue = this.getColorHue(color);
        let hueIndex = hues.indexOf(hue.toString());
        let steps = 11;

        splitComplement.push(color);

        for(let i = 0; i <= 1; i++) {
            let nextColorObj = this.getNextColorObjBySteps(hueIndex, steps);

            if(typeof nextColorObj !== "undefined") {
                let foundColor = this.getMatchingColorInColorObj(color.hsv, nextColorObj)

                splitComplement.push(foundColor);
            }

            steps += 2;
        }

        return splitComplement;
    }

    getSquareColors(color) {
        let squareColors = [];

        let hues = this.getHues();
        let hue = this.getColorHue(color);
        let hueIndex = hues.indexOf(hue.toString());
        let steps = 6;

        squareColors.push(color);

        for(let i = 0; i <= 2; i++) {
            let nextColorObj = this.getNextColorObjBySteps(hueIndex, steps);

            if(typeof nextColorObj !== "undefined") {
                let foundColor = this.getMatchingColorInColorObj(color.hsv, nextColorObj)

                squareColors.push(foundColor);
            }

            steps += 6;
        }

        return squareColors;
    }

    //----------------------------------------------------------------------------------------------------------
    //convenience functions

    /**
     * Gibt ein Farbobjekt anhand des gegebenen Farbtons zurück
     * @param hue --> Farbton
     * @returns {*} --> Farbobjekt, welches den gegegebenen Farbton besitzt
     */
    getColorObjByHue(hue) {
        return this.getMartianColors()[hue];
    }

    /**
     * Gibt das erste Farbobjekt zurück
     * @returns {*} --> Farbobjekt
     */
    getFirstColorObj() {
        let hue = this.getHues()[0];

        return this.getColorObjByHue(hue);
    }

    /**
     * Gibt das letzte Farbobjekt zurück
     * @returns {*} --> Farbobjekt
     */
    getLastColorObj() {
        let hues = this.getHues();
        let hue = hues[hues.length - 1];

        return this.getColorObjByHue(hue);
    }

    /**
     * Gibt das Farbobjekt zurück, welches den gegebenen index besitzt
     * @param index --> Zahlenwert
     */
    getColorObjByIndex(index) {
        let hues = this.getHues();
        let maxIndex = Object.keys(martianColors).length - 1;
        let colorObj = undefined;

        if(index <= maxIndex) {
            colorObj = this.getColorObjByHue(hues[index]);
        } else {
            console.warn(`No element found by index ${index}`);
        }

        return colorObj;
    }

    /**
     * Gibt das Farbobjekt zurück, welches im Farbrad die Position, welche sich aus der derzeitigen Position
     * addiert mit den Schritten ergibt, besitzt
     * @param currentIndex --> Zahlenwert
     * @param steps --> Zahlenwert
     */
    getNextColorObjBySteps(currentIndex, steps) {
        let hues = this.getHues();
        let nextIndex = currentIndex + steps;
        let maxIndex = Object.keys(hues).length - 1;

        if(nextIndex < 0) {
            nextIndex = (nextIndex + maxIndex) + 1;
        } else if (nextIndex > maxIndex) {
            nextIndex = (nextIndex - maxIndex) - 1;
        }

        return this.getColorObjByIndex(nextIndex);
    }

    /**
     * Gibt alle Farben des gegebenen Farbobjekts zurück
     * @param colorObj --> Farbobjekt
     * @param includeAchromatic --> Sollen die achromatischen Farben inkludiert werden
     * @returns {*[]} --> Ein Array aus den Farben des Objekts
     */
    getColorsByColorObj(colorObj, includeAchromatic) {
        let allColors;

        if(includeAchromatic) {
            allColors = [].concat(colorObj.representative, colorObj.tints, colorObj.shades, colorObj.achromatic ? colorObj.achromatic : [])
        } else {
            allColors = [].concat(colorObj.representative, colorObj.tints, colorObj.shades);
        }

        return allColors;
    }

    /**
     * Gibt die passende Farbe in dem gegebenen Farbobjekt zurück, welche dem gegebenen Hsv String entspricht.
     * Ihr findet ein Vergleich zwischen der saturation (Sättigung) und der intensity (Intensität) statt.
     * @param hsvString --> Zeichenkette
     * @param colorObj --> Farbobjekt
     */
    getMatchingColorInColorObj(hsvString, colorObj) {
        let color = undefined;
        let colors = this.getColorsByColorObj(colorObj);
        let hsvOfParam = hsvString.match(this.hsvExtractor);

        for(let element of colors) {
            let hsv = element.hsv.match(this.hsvExtractor);

            if(hsv[1] === hsvOfParam[1] && hsv[2] === hsvOfParam[2]){
                color = element;
                break;
            }
        }

        return color;

    }

    /**
     * Gibt alle Farben des Martian-Color-Farbrads zurück.
     * @param includeAchromatic --> Sollen die achromatischen Farben inkludiert werden
     * @returns {[]} --> Array, welches alle Farben enthält
     */
    getAllColors(includeAchromatic) {
        let colors = [];
        let hues = this.getHues();
        let martianColors = this.getMartianColors();

        hues.forEach(hue => {
            let hueColors = this.getColorsByColorObj(martianColors[hue], includeAchromatic);

            colors = colors.concat(hueColors);
        })

        return colors;
    }

    getAllRepresentativeColors() {
        let martianColors = this.getMartianColors();
        let representatives = []

        for(const [key, value] of Object.entries(martianColors)) {
            if(value.achromatic) {
                representatives = representatives.concat(value.achromatic);
            }
            representatives = representatives.concat(value.representative);
        }

        return representatives;
    }

    /**
     * Gibt alle warmen Farben aus dem Martian-Color-Farbrads zurück.
     * @returns {[]} --> Array, welche alle warmen Farben enthält
     */
    getWarmColors() {
        let allColors = this.getAllColors();
        let warmColors = [];

        allColors.forEach(color => {
            let hsv = color.hsv.match(this.hsvExtractor);

            if(hsv[0] < 120 || hsv[0] >= 333){
                warmColors.push(color);
            }
        })

        return warmColors;
    }

    /**
     * Gibt alle kalten Farben aus dem Martian-Color-Farbrads zurück.
     * @returns {[]} --> Array, welche alle kalten Farben enthält
     */
    getColdColors() {
        let allColors = this.getAllColors();
        let coldColors = [];

        allColors.forEach(color => {
            let hsv = color.hsv.match(this.hsvExtractor);

            if(hsv[0] < 333 && hsv[0] >= 120){
                coldColors.push(color);
            }
        })

        return coldColors;
    }

    /**
     * Expects a String including three digits. The first one is the hue, the second one the saturation
     * and the third one the value/brightness/intensity.
     *
     * If no color is found the user will be warned and undefined will be returned.
     * @param colorHsv
     */
    findColorByHsvStr(colorHsv) {
        let extractValues = colorHsv.match(this.hsvExtractor);

        if(extractValues === null || extractValues.length !== 3) {
            console.warn(`Incorrect hsv format, nothing found for ${colorHsv}`)
            return undefined;
        }

        let hue = extractValues[0];
        let saturation = extractValues[1];
        let intensity = extractValues[2];

        return this.findColorByHsv(`hsv(${hue}, ${saturation}%, ${intensity}%)`);
    }

    /**
     * Get the color of the martian color wheel with the given hue, saturation and intensity
     *
     * If no color is found the user will be warned and undefined will be returned.
     * @param colorHsv
     */
    findColorByHsv(hsvString) {
        let color = undefined;
        let allColors = this.getAllColors(true);

        for(let element of allColors) {
            if(element.hsv === hsvString) {
                color = element;
                break;
            }
        }

        if(typeof color === "undefined") {
            console.warn(`No color found for ${hsvString}`);
        }

        return color;
    }

    /**
     * Expects a String including the name of the wanted color.
     *
     * If no color is found the user will be warned and undefined will be returned.
     * @param colorHsv
     */
    findColorByName(colorName) {
        let foundColor = undefined;
        let martianColors = this.getAllColors();

        colorName = colorName.toLowerCase();

        for(let element of martianColors) {
            if(element.name.toLowerCase() === colorName) {
                foundColor = element;
                break;
            }
        }

        if(typeof foundColor === "undefined") {
            console.warn("No color found for " + colorName);
        }

        return foundColor;
    }

    /**
     * Check wether the two colors are equivalent. The expected format is {'i18N': value, 'hue': value, 'saturation': value, 'intensity': value,}
     * @param colorOne
     * @param colorTwo
     * @returns {boolean|boolean}
     */
    compareColors(colorOne, colorTwo) {
        return colorOne.hsv === colorTwo.hsv;
    }

    getColorHue(color) {
        let hsv = color.hsv.match(this.hsvExtractor);

        return hsv[0];
    }

}

export default ColorHandler;