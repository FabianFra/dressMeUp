import LoggingTool from "./LoggingTool.js";
import MartianColorHandler from "./MartianColorHandler.js";
import FabscheAlgorithm from "./FabscheAlgorithm.js";
import HelperTool from "./Helpertool.js";

/*
 * Die Klasse realisiert die Business-Idee des One-Color-Tricks.
 *
 */
export default class OneColorTrick {

    /**
     * Konstruktor der Klasse
     *
     * @param searchOption: Stellt die Id der Suchoption dar (siehe FabscheAlgorithmus.SEARCH_OPTIONS).
     * @param currentOutfit: Ist die Menge der Hex-Werte der Garderobe des Anwenders.
     * @param user: Ist das Nutzerobjekt des Anwenders.
     */
    constructor(searchOption, currentOutfit, user) {
        this.searchOption = searchOption
        this.currentOutfit = HelperTool.isDeclaredAndNotNull(currentOutfit) ? currentOutfit : [];
        this.user = user;
        this.martianColorHandler = new MartianColorHandler();

        if(!HelperTool.isDeclaredAndNotNull(searchOption)) {
            LoggingTool.printError(`The passed search option ${searchOption} is invalid`)
        }

        LoggingTool.printDebug(`OneColorTrick constructor:
        searchOption: ${JSON.stringify(this.searchOption)}
        currentOutfit: ${JSON.stringify(this.currentOutfit)}
        desirableColors: ${JSON.stringify(this.user.desirableColors)}
        undesirableColors: ${JSON.stringify(this.user.undesirableColors)}
        matchingColors: ${JSON.stringify(this.user.seasonTypeMatchingColors)}`)

        this.executeAnalysis();
    }

    /**
     * Führt die Voranalyse aus.
     *
     * Schritte:
     *
     *  1. Das derzeitige Outfit wird analisiert (siehe analyseCurrentOutfit)
     *  2. Das Ergebnis aus Schritt 1 wird untersucht, um die Anwendbarkeit des Tricks zu identifizieren (siehe executeAnalysisForShirt).
     */
    executeAnalysis() {
        this.analysisObject = this.analyseCurrentOutfit();

        if(this.searchOption === FabscheAlgorithm.SEARCH_OPTIONS.SHIRT) {
            this.result = this.executeAnalysisForShirt()
        }

        this.result.forEach(color => {
            LoggingTool.printDebug(this.martianColorHandler.findColorByHex(color));
        })
    }

    //-------------------------------------------------------------------------
    // Analysis

    executeAnalysisForShirt() {
        let isNeutralOutfit = this.isNeutralOutfit();
        let result = [];

        if(isNeutralOutfit) {
            result = this.getMatchingColors();
        } else {
            LoggingTool.printLog("The One-Colour-Trick can't be used on the current assembled outfit," +
                " two colours in it.", this.currentOutfit);
        }

        return result;
    }

    getMatchingColors() {
        let nonNeutralColors = this.analysisObject.otherColors;
        let neutralColors = [];
        let otherColors = [];


        MartianColorHandler.NEUTRAL_COLORS.forEach(neutralColor => {
            if(!this.user.postponesColor(neutralColor)) {
                if(this.user.desiresColor(neutralColor)) {
                    neutralColors.unshift(neutralColor);
                } else {
                    neutralColors.push(neutralColor);
                }
            }
        })

        if(nonNeutralColors.length === 0) {

            /**
             * Iteriert über die Menge der Farben, welche zu den Jahreszeittypen des Benutzers gehören und fügt diese
             * zur Ergebnismenge hinzu.
             */
            this.user.seasonTypeMatchingColors.forEach(seasonTypeMatchingColor => {
                if(!this.martianColorHandler.isNeutralColor(seasonTypeMatchingColor)) {
                    if(!this.user.postponesColor(seasonTypeMatchingColor)) {
                        if(this.user.desiresColor(seasonTypeMatchingColor)) {
                            otherColors.unshift(seasonTypeMatchingColor);
                        } else {
                            otherColors.push(seasonTypeMatchingColor)
                        }
                    }
                }
            })

            /**
             * Iteriert über die Menge der präferierten Farben und selektiert diese und ihre monochromatischen Farben aus.
             * Falls die präferierte Farbe eine neutrale Farbe ist, wird nur diese zur Ergebnismenge hinzugefügt.
             */
            this.user.desirableColors.forEach(desirableColor => {
                if(!this.martianColorHandler.isNeutralColor(desirableColor)) {
                    let martianColor = this.martianColorHandler.findColorByHex(desirableColor);
                    let monochromaticColors = this.martianColorHandler.getMonochromaticColors(martianColor, "hex");

                    monochromaticColors.forEach(monochromaticColor => {
                        if(!this.user.postponesColor(monochromaticColor) && !HelperTool.isInArray(monochromaticColor, otherColors)) {
                            if(this.user.desiresColor(monochromaticColor)) {
                                otherColors.unshift(monochromaticColor);
                            } else {
                                otherColors.push(monochromaticColor);
                            }
                        }
                    })
                }
            })

            /**
             * Falls die Länge der Ergebnismenge den Wert {maxResultLength} unterschreitet, werden solange zufällige Farben
             * hinzugefügt bis die Bedingung erfüllt ist.
             *
             */
            let maxResultLength = 40;
            if(otherColors.length < maxResultLength) {
                let randomColors = this.getRandomColorsForTheUser(maxResultLength - otherColors.length, otherColors);
                otherColors = HelperTool.mergeArrays(otherColors, randomColors, true, true);
            }

        } else if(nonNeutralColors.length === 1) {
            let preSelectedColorHex = this.analysisObject.otherColors[0];
            let preSelectedColor = this.martianColorHandler.findColorByHex(preSelectedColorHex);

            if(typeof preSelectedColor === "undefined") {
                LoggingTool.printError(`Couldn't find a matching martian color for the color hex ${preSelectedColorHex}`)
            }

            let monochromaticColors = this.martianColorHandler.getMonochromaticColors(preSelectedColor, "hex");

            monochromaticColors.forEach(monochromaticColor => {
                if(!this.user.postponesColor(monochromaticColor) && !HelperTool.isInArray(monochromaticColor, otherColors)) {
                    if(this.user.desiresColor(monochromaticColor)) {
                        otherColors.unshift(monochromaticColor);
                    } else {
                        otherColors.push(monochromaticColor);
                    }
                }

            })
        }

        LoggingTool.printDebug("getMatchingColors() neutralColors --> ", this.martianColorHandler.printColorsByHex(neutralColors));
        LoggingTool.printDebug("getMatchingColors() otherColors --> ", this.martianColorHandler.printColorsByHex(otherColors));

        return HelperTool.mergeArrays(neutralColors, otherColors, true, true);
    }

    //-------------------------------------------------------------------------
    // Convenience methods

    /**
     * Voranalyse
     *
     * Analysiert das derzeitige Outfit auf neutrale Farben. Hier werden die Farben nach neutralen und normalen Farben
     * sortiert. Am Ende der Funktion wird der Anteil der neutralen Farben an dem Outfit ausgerechnet.
     *
     * @param colorArray
     */
    analyseCurrentOutfit() {
        let analysisObject = { neutralColors: [], otherColors: []};
        let selectedColors = this.currentOutfit;

        selectedColors.forEach(selectedColor => {
            if(this.martianColorHandler.isNeutralColor(selectedColor)) {
                analysisObject.neutralColors.push(selectedColor);
            } else {
                analysisObject.otherColors.push(selectedColor);
            }
        })

        return analysisObject;
    }

    /**
     * Diese Funktion dient zur Überprüfung, ob die ausgewählten Farben, welche nicht zu der Familie der neutralen Farben
     * gehören, von der gleichen Farbfamilie abstammen.
     *
     * colors = {neutralColors: [], otherColors: []}
     */
    isNeutralOutfit() {
        let analysisObject = this.analysisObject;
        let otherColors = analysisObject.otherColors;
        let isNeutralOutfit;

        if(otherColors.length === 2) {
            LoggingTool.printDebug("The current outfit consists out of two colors, hence it will be examined if they are monochromatic.")
            isNeutralOutfit = this.martianColorHandler.colorsAreMonochromatic(otherColors);
        } else if(otherColors.length < 2) {
            LoggingTool.printDebug(`The current outfit consists out of ${otherColors.length} color(s)`)
            isNeutralOutfit = true;
        } else {
            isNeutralOutfit = false;
        }

        LoggingTool.printDebug("isNeutralOutfit --> " + isNeutralOutfit);

        return isNeutralOutfit;
    }

    getRandomColorsForTheUser(maxLength, uniqueIn) {
        let colors = [];
        let usedIndex = [];

        while(colors.length < maxLength) {
            let maxIndex = this.martianColorHandler.getHues().length;
            let randIndex = HelperTool.getRandomInt(maxIndex, true, usedIndex);
            let randomColors = this.martianColorHandler.getColorsByColorObj(this.martianColorHandler.getNextColorObjBySteps(0, randIndex));

            for(let i = 0; i < randomColors.length; i++) {
                let randomColor = randomColors[i];

                if(colors.length < maxLength) {
                    if(!this.user.postponesColor(randomColor.hex) && !HelperTool.isInArray(randomColor.hex, uniqueIn)) {
                        colors.push(randomColor.hex);
                    }
                } else {
                    break;
                }
            }

            usedIndex.push(randIndex);
        }

        return colors;
    }
}