import LoggingTool from "./LoggingTool";
import FabscheAlgorithm from "./FabscheAlgorithm";
import OneColorTrick from "./OneColorTrick.js";
import HelperTool from "./Helpertool.js";
import TinyColor from "../../frameworks/TinyColor/tinycolor"


export default class SearchForTop extends FabscheAlgorithm{

    constructor(answers, user) {
        super(answers, user);
        this.answers = answers;
        this.user = user;
        this.martianColorHandler = FabscheAlgorithm.prototype.martianColorHandler;
        this.searchForTheRightShirt();
    }

    searchForTheRightShirt() {

        let oneColorTrick = new OneColorTrick(FabscheAlgorithm.SEARCH_OPTIONS.SHIRT, this.getOutfitColors(), this.user);
        let matchingColorsOCT = oneColorTrick.result;

        let matchingColorsForTop = this.getMatchingColors();
        let unfilteredArray = HelperTool.mergeArrays(matchingColorsOCT, matchingColorsForTop, true, true);
        let filteredArray = FabscheAlgorithm.filterOutBySaturationOrByLightness(unfilteredArray, this.answers.preferSaturatedColors, this.answers.preferLightColors);

        filteredArray = HelperTool.mergeArrays(this.martianColorHandler.getAllAchromaticColors(true).map(color => color.hex), filteredArray, true, true);
        let sortedArray = this.executeSortAlgorithm(filteredArray);

        this.resultObject = sortedArray;
    }

    /**
     * Anhand von der gegebenen Hautfarbe wird zurückgegeben, ob das Oberteil eher hell oder dunkel sein soll.
     * Die Regel beschreibt hier, dass ein Kontrast zwischen der Haut- und der Shirt-Farbe hergestellt werden sollte d.h.
     * besitzt der Benutzer eine helle Hautfarbe, sollte er eher auf dunkle T-Shirts zurückgreifen, hat er eine dunklere
     * Hautfarbe vice versa.
     *
     * @param skinColor
     * @returns {boolean}
     */
    shirtLightnessBasedOnTheSkinColor() {
        return !TinyColor(this.user.skinColor).isLight();
    }

    shirtLightnessBasedOnTheJacketColor() {
        return !TinyColor(this.answers.jacket).isLight();
    }

    /**
     * Anhand von der gegebenen Farbe der Hose, wir zurückgegeben, ob das Oberteil eher dunkel oder hell sein sollte.
     * Die Regel beschreibt hier, einen Kontrast zwischen Unterteil und Oberteil herzustellen. Es gibt jedoch hier
     * Ausnahmen wir Scharz auf Schwarz.
     * @returns {*}
     */
    shirtLightnessBasedOnTrousersColor() {
        return !TinyColor(this.answers.trousers).isLight();
    }

    getOutfitColors() {
        let outfitColors;
        let parameters = this.answers;

        if(this.userWearsJacket()) {
            outfitColors = [parameters["jacket"], parameters["trousers"], parameters["shoes"]];
        } else {
            outfitColors = [parameters["trousers"], parameters["shoes"]];
        }

        return outfitColors;
    }

    /**
     * - Allgemeine Regeln -
     * Im Bezug zur Hautfarbe: Die Farbe sollte im Kontrast zur Hautfarbe stehen bzw. nicht zu nah an der Hautfarbe
     * dran sein d.h. hellere Haut = dukleres T-Shirt, dunklere Haut = helleres T-Shirt
     *
     * Im Bezug zur Hose: Die Farbe sollte nicht zu nah an der Farbe der Hose sein bzw. gleich derer sein.
     * Hier funktioniert ein konstrastreiches Schema (es gibt Ausnhamen wie z.B. Schwarz und Schwarz). Das T-Shirt sollte
     * eine hellere Farbe haben, wenn die Hose dunkel ist, falls sie hell ist vice versa.
     *
     * Im Bezug zur Jacke: Falls der Benutzer eine Jacke tragen möchte, sollte die Jackenfarbe kontrastreich zur Farbe
     * des T-Shirts sein.
     *
     * Im Bezug auf die Augen: Falls der Benutzer seinen Augen schmeicheln möchte, sollten analoge Farben bei der
     * Wahl der T-Shirtfarbe verwendet werden. Möchte der Benutzer seine Augen in den Fokus stellen, sind hier
     * kontrastreiche Farben zu wählen.
     *
     * - Farbschemata -
     * monochroma Farben: harmonisieren und wirken ruhig
     * komplementäre Farben: kontrastreich und wirken akzentuiert, laut und spannungsgeladen (Shirt wantToStandout)
     *
     * analoge Farben: wirkt einheitlich, harmonisch und ruhig
     * triadische Farben: wirkt extrem, laut, schrill, plakativ, aber auch bunt und lebendig (wantToStandout)
     * teilkomplementäre Farben: wirkt kräftig, aber nicht so intensiv wie komplementäre Farben (Shirt !wantToStandout)
     *
     * tetradische Farben: wirkt bunt, extrem und lebendig (wantToStandout)
     */
    getMatchingColors() {
        let matchingColors;

        if(HelperTool.isDeclaredAndNotNull(this.answers.preferLightColors)) {
            if(this.answers.preferLightColors) {
                matchingColors = this.getLightColorsForUser(this.userWearsJacket());
            } else {
                matchingColors = this.getDarkColorsForUser(this.userWearsJacket());
            }
        } else {
            if(this.userWearsJacket()) {
                LoggingTool.printLog("The user wears a jacket");

                let shirtLightnessBasedOnJacketColor = this.shirtLightnessBasedOnTheJacketColor();

                if(shirtLightnessBasedOnJacketColor) {
                    matchingColors = this.getLightColorsForUser(true);
                } else {
                    matchingColors = this.getDarkColorsForUser(true);
                }
            } else {
                LoggingTool.printLog("The user doesn't wear a jacket");

                let shirtLightnessBasedOnSkinColor = this.shirtLightnessBasedOnTheSkinColor();

                if(shirtLightnessBasedOnSkinColor) {
                    LoggingTool.printLog("The shirt should be light based on the skin's color");
                    matchingColors = this.getLightColorsForUser(false);
                } else {
                    LoggingTool.printLog("The shirt should be dark based on the skin's color");
                    matchingColors = this.getDarkColorsForUser(false);
                }
            }
        }


        //LoggingTool.printLog("Unsorted array: ", this.martianColorHandler.printColorsByHex(colors));
        //LoggingTool.printLog("Sorted array: ", this.martianColorHandler.printColorsByHex(this.executeSortAlgorithm(colors)))

        return matchingColors;
    }

    getLightColorsForUser(wearsJacket) {
        let matchingColors = [];
        let tints = this.martianColorHandler.getTints(null, true,  "hex");
        let lightAchromaticColors = this.martianColorHandler.getLightAchromaticColors("hex");

        tints.concat(lightAchromaticColors).forEach(color => {
            if(!this.user.postponesColor(color)) {
                if(!HelperTool.isInArray(color, matchingColors) && color !== this.answers.trousersColor) {
                    if(wearsJacket && color !== this.answers.jacketColor) {
                        matchingColors.push(color);
                    } else {
                        matchingColors.push(color);
                    }

                }
            }
        })

        return matchingColors;
    }

    getDarkColorsForUser(wearsJacket) {
        let matchingColors = [];
        let shades = this.martianColorHandler.getShades(null, true, "hex");
        let darkAchromaticColors = this.martianColorHandler.getDarkAchromaticColors("hex");

        darkAchromaticColors.concat(shades).forEach(color => {
            if(!this.user.postponesColor(color)) {
                if(!HelperTool.isInArray(color, matchingColors) && (color !== this.answers.trousersColor || color === "#000000")) {
                    if(wearsJacket && color !== this.answers.jacketColor) {
                        matchingColors.push(color);
                    } else {
                        matchingColors.push(color);
                    }

                }
            }
        })

        return matchingColors;
    }

    /**
     * https://itnext.io/sorting-algorithms-in-javascript-4c3b7b80e88d //Vielleicht später umbauen zu Merge Sort
     *
     * @param array
     * @returns {*[]}
     */
    executeSortAlgorithm(array) {
        let unsortedArray = [...array];
        let answers = this.answers;

        const trouserIsLight = TinyColor(answers.trousers).isLight();
        const shoesAreLight = TinyColor(answers.shoes).isLight();

        let iterations = 0;

        /**
         * Das Ergebnis der Compare-Funktion ist
         *
         * -1: X steht vor Y
         * 0: Reihenfolge bleibt bestehen
         * 1: Y steht vor X
         */
        unsortedArray.sort((x, y) => {
            let result = 0; // -1, 0, 1
            let xMartianColor = this.martianColorHandler.findColorByHex(x);
            let yMartianColor = this.martianColorHandler.findColorByHex(y);

            //-----------------------------------------------------------------
            // Check that the colors don't match with the trousers's color

            if(x !== answers.trousers && y === answers.trousers) {
                result = -1;
            } else if(x === answers.trousers && y !== answers.trousers) {
                result = 1;
            }

            //-----------------------------------------------------------------
            // Check if the colors match with the color of the shoes

            if(x !== answers.shoes && y === answers.shoes) {
                result = 1;
            } else if(x === answers.shoes && y !== answers.shoes) {
                result = -1;
            }

            //-----------------------------------------------------------------
            //In regard to the lightness preference

            if(result === 0 && this.answers.preferLightColors !== null) {
                result = this.sortByLightness(x, y, this.answers.preferLightColors);
            }

            //-----------------------------------------------------------------
            //In regard to preferred colors

            if(result === 0) {
                result = this.sortByPreferred(x, y);
            }


            //-----------------------------------------------------------------
            // Is it a neutral color

            if(result === 0) {
                if(this.martianColorHandler.isNeutralColor(x) && !this.martianColorHandler.isNeutralColor(y)) {
                    result = -1;
                } else if (!this.martianColorHandler.isNeutralColor(x) && this.martianColorHandler.isNeutralColor(y)) {
                    result = 1;
                }
            }

            //-----------------------------------------------------------------
            // In regard to the matching colors of the season type

            if(result === 0) {
                result = this.sortBySeasonTypeColors(x, y)
            }

            //-----------------------------------------------------------------
            //Contrast to trouser's color (color)

            if(result === 0 && !this.martianColorHandler.isAchromaticColor(answers.trousers)) {
                this.sortByTrouserColor(x, y)
            }

            //-----------------------------------------------------------------
            // In regard to the shoes (color and equality)

            if(result === 0 && !this.martianColorHandler.isAchromaticColor(answers.shoes)) {
                this.sortByShoeColor(x, y);
            }

            //-----------------------------------------------------------------
            //Contrast to jacket's color (color)

            if(result === 0 && this.userWearsJacket() && !this.martianColorHandler.isAchromaticColor(answers.jacket)) {
                this.sortByJacketColor(x, y)
            }

            //-----------------------------------------------------------------
            // In regard to the eye color

            if(result === 0 && this.user.focusEyeColor !== null) {
                result = this.sortByEyeColor(x, y);
            }

            iterations++;
            return result;
        })



        return unsortedArray;
    }

    /**
     * Vergleicht die beiden Werte, ob diese zu den präferierten oder nicht präferierten Farben gehören
     *
     * X ist bevorzugt zu Y
     * X und Y sind gleichgestellt
     * Y ist bevorzugt zu X
     *
     */
    sortByPreferred(x, y) {
        let result = 0;

        if(!this.user.postponesColor(x) && this.user.postponesColor(y)) {
            result = -1;
        } else if(this.user.postponesColor(x) && !this.user.postponesColor(y)) {
            result = 1;
        } else if(!this.user.postponesColor(x) && !this.user.postponesColor(y)) {
            if(this.user.desiresColor(x) && !this.user.desiresColor(y)) {
                result = -1;
            } else if(!this.user.desiresColor(x) && this.user.desiresColor(y)) {
                result = 1;
            }
        }

        return result;
    }

    /**
     * Vergleicht die beiden Werte, ob diese den gewünschten Effekt auf die Augen des Nutzers haben.
     *
     * @param x
     * @param y
     * @returns {number}
     */
    sortByEyeColor(x, y) {
        return this.sortByExistence(x, y, this.getColorsByEyes());
    }

    sortByJacketColor(x, y) {
        return this.sortByExistence(x, y, this.getColorsByJacket());
    }

    sortByTrouserColor(x, y) {
        let result = 0;
        let trouserColor = this.answers.trousers;

        if(x !== trouserColor && y === trouserColor) {
            result = -1;
        } else if(x === trouserColor && y !== trouserColor) {
            result = 1;
        } else {
            result = this.sortByExistence(x, y, this.getColorsByTrousers());
        }

        return result;
    }

    sortByShoeColor(x, y) {
        let result = 0;
        let shoeColor = this.answers.shoes;

        if(x === shoeColor && y !== shoeColor) {
            result = -1;
        } else if(x !== shoeColor && y === shoeColor) {
            result = 1;
        } else {
            result = this.sortByExistence(x, y, this.getColorsByShoes());
        }

        return result;
    }

    /**
     * Vergleicht die zwei Werte auf die gewünschte Helligkeit.
     *
     * @param x
     * @param y
     * @param isLight
     * @returns {number}
     */
    sortByLightness(x, y, isLight) {
        let result = 0;

        if(isLight) {
            if(TinyColor(x).isLight() < TinyColor(y).isLight()) {
                result = 1
            } else if(TinyColor(x).isLight() > TinyColor(y).isLight()) {
                result = -1
            }
        } else {
            if(TinyColor(x).isLight() < TinyColor(y).isLight()) {
                result = -1
            } else if(TinyColor(x).isLight() > TinyColor(y).isLight()) {
                result = 1
            }
        }

        return result;
    }

    sortByExistence(x, y, array) {
        let result = 0;

        if(HelperTool.isInArray(x, array) && !HelperTool.isInArray(y, array)) {
            result = -1;
        } else if(!HelperTool.isInArray(x, array) && HelperTool.isInArray(y, array)) {
            result = 1;
        }

        return result;
    }

    /**
     * Sortiert die Farben nach deren Sättigung. Falls beide Farben die gleiche Sättigung haben, wird auf den Value-Wert
     * der Farben überprüft. Hierbei wird der HSV-Wert benutzt.
     *
     * @param x -> Objekt, welches einen validen HSV-Wert besitzt
     * @param y -> Object, welches einen validen HSV-Wert besitzt
     * @returns {number}
     */
    sortBySaturation(x, y) {
        let xSaturation = this.martianColorHandler.getSaturationOfColor(x, true);
        let ySaturation = this.martianColorHandler.getSaturationOfColor(y, true);
        let result = 0;

        if(this.user.preferSaturatedColors) {
            if(xSaturation < ySaturation) {
                result = 1;
            } else if(xSaturation > ySaturation) {
                result = -1;
            }
        } else {
            if(xSaturation < ySaturation) {
                result = 1;
            } else if(xSaturation > ySaturation) {
                result = -1;
            } else {
                let xBrightness = TinyColor(x.hex).getBrightness();
                let yBrightness = TinyColor(y.hex).getBrightness();

                if(xBrightness > yBrightness) {
                    result = -1;
                } else if(xBrightness < yBrightness) {
                    result = 1;
                }
            }

        }

        /**
         * Für den Fall, dass beide Farben den gleichen Sättigungswert haben
         */
        if(result === 0) {
            let xValue = this.martianColorHandler.getValueOfColor(x, true);
            let yValue = this.martianColorHandler.getValueOfColor(y, true);

            if(this.user.preferSaturatedColors) {
                if(xValue < yValue) {
                    result = -1;
                } else if(xValue > yValue) {
                    result = 1;
                }
            } else {
                if(xValue > yValue) {
                    result = 1;
                } else if(xValue < yValue) {
                    result = -1;
                }
            }
        }

        return result;
    }

    /**
     * Sortiert die Farben nach ihrer Existenz in der Menge von Farben, welche zu ihrem Jahreszeittypen passt.
     *
     * @param x
     * @param y
     * @returns {number}
     */
    sortBySeasonTypeColors(x, y) {
        return this.sortByExistence(x, y, this.user.seasonTypeMatchingColors);
    }

    //-------------------------------------------------------------------------
    // Merge-Sort
    //
    // Source: https://itnext.io/sorting-algorithms-in-javascript-4c3b7b80e88d

    static mergeSortAlgorithm(array) {

        let middlePoint = array.length / 2

        if(array.length < 2) {
            return array
        }

        let leftPart = array.splice(0, middlePoint);

        return Top.mergeArraysForMergeSort(this.mergeSortAlgorithm(leftPart), this.mergeSortAlgorithm(array));

    }

    static mergeArraysForMergeSort(array1, array2) {
        let list = []

        while(array1.length && array2.length) {
            // Hier kommen dann die Bedinungen rein
            if(array1[0] < array2[0]) {
                list.push(array1.shift());
            } else {
                list.push(array2.shift());
            }
        }

        return [...list, ...array1, ...array2];
    }


    //-------------------------------------------------------------------------
    // Convenience methods

    userWearsJacket() {
        return HelperTool.isDeclaredAndNotNull(this.answers["jacket"]);
    }

    userWantsToStandOut() {
        return HelperTool.isDeclaredAndNotNull(this.answers.wantToStandOut) && this.answers.wantToStandOut;
    }

    getColorsByTrousers() {
        if(!HelperTool.isDeclaredAndNotNull(this.matchingColorsByTrousers)) {
            if(HelperTool.isDeclaredAndNotNull(this.answers.trousers) && !this.martianColorHandler.isNeutralColor(this.answers.trousers)) {
                let matchingColors = []
                let trouserMartianColor = this.martianColorHandler.findColorByHex(this.answers.trousers);

                if(trouserMartianColor !== null) {
                    if(this.userWantsToStandOut()) {
                        matchingColors = this.martianColorHandler.getComplementColor(trouserMartianColor, "hex");
                    } else {
                        matchingColors = this.martianColorHandler.getSplitComplementaryColors(trouserMartianColor, "hex");
                    }
                }

                this.matchingColorsByTrousers = matchingColors;
            } else {
                LoggingTool.printWarn("getColorsByTrousers() -> Trouser's color is not defined.");
            }
        }

        return this.matchingColorsByTrousers;
    }

    getColorsByShoes() {
        if(!HelperTool.isDeclaredAndNotNull(this.matchingColorsByShoes)) {
            if(HelperTool.isDeclaredAndNotNull(this.answers.shoes) && !this.martianColorHandler.isNeutralColor(this.answers.shoes)) {
                let matchingColor = [];
                let shoeColor = this.martianColorHandler.findColorByHex(this.answers.shoes);

                if(shoeColor !== null) {
                    let monochromaticColors = this.martianColorHandler.getMonochromaticColors(shoeColor, "hex");
                    let analogousColors = this.martianColorHandler.getAnalogousColors(shoeColor, false,"hex")

                    matchingColor = HelperTool.mergeArrays(monochromaticColors, analogousColors, true, true);
                }

                this.matchingColorsByShoes = matchingColor;
            } else {
                LoggingTool.printWarn("getColorsByShoes() -> Shoe's color is not defined.");
            }
        }

        return this.matchingColorsByShoes;
    }

    getColorsByJacket() {
        if(!HelperTool.isDeclaredAndNotNull(this.matchingColorsByJacket)) {
            if (HelperTool.isDeclaredAndNotNull(this.answers.jacket) && !this.martianColorHandler.isNeutralColor(this.answers.jacket)) {
                let matchingColors = [];
                let jacketMartianColor = this.martianColorHandler.findColorByHex(this.answers.jacket);
                let jacketColorIsLight = TinyColor(this.answers.jacket).isLight();

                if (jacketMartianColor !== null) {
                    if (this.userWantsToStandOut()) {
                        matchingColors = this.martianColorHandler.getComplementColor(jacketMartianColor, "hex");
                    } else {
                        matchingColors = this.martianColorHandler.getSplitComplementaryColors(jacketMartianColor, "hex");
                    }

                    let monochromaticColors = this.martianColorHandler.getMonochromaticColors(jacketMartianColor, "hex", !jacketColorIsLight);

                    if (!HelperTool.isEmpty(monochromaticColors)) {
                        matchingColors = matchingColors.concat(monochromaticColors);
                    }

                    let analogousColors = this.martianColorHandler.getAnalogousColors(jacketMartianColor, false, "hex");

                    if (!HelperTool.isEmpty(analogousColors)) {
                        matchingColors = matchingColors.concat(analogousColors);
                    }

                    this.matchingColorsByJacket = matchingColors;
                }
            } else {
                LoggingTool.printWarn("getColorsByTrousers() -> Trouser's color is not defined.");
            }
        }

        return this.matchingColorsByJacket;
    }

    getColorsByEyes() {
        if (!HelperTool.isDeclaredAndNotNull(this.matchingColorsByEyes)) {
            if (HelperTool.isDeclaredAndNotNull(this.answers.focusEyeColor)) {
                let matchingColors;
                let eyeMartianColor = this.martianColorHandler.findColorByHex(this.user.eyeColor);

                if (this.answers.focusEyeColor) {
                    matchingColors = this.martianColorHandler.getComplementColor(eyeMartianColor, "hex");
                    matchingColors = matchingColors.concat(this.martianColorHandler.getSplitComplementaryColors(eyeMartianColor, "hex"));
                } else {
                    matchingColors = this.martianColorHandler.getMonochromaticColors(eyeMartianColor, "hex");
                    matchingColors = matchingColors.concat(this.martianColorHandler.getAnalogousColors(eyeMartianColor, false, "hex")) //TODO Check if full analogous would suit
                }

                this.matchingColorsByEyes = matchingColors;
            }
        }

        return this.matchingColorsByEyes;
    }
}

window.SearchForTop = SearchForTop;