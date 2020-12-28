import MartianColorHandler from "./MartianColorHandler.js";

/*
 * Die Klasse beinhaltet allgemeingültige Vorgaben und Verhaltensweisen für die von ihr erbenden
 * Klassen.
 *
 */
export default class FabscheAlgorithm {

    //-------------------------------------------------------------------------
    // Constructor(s)

    /**
     * Der Konstruktor der Klasse.
     *
     * @param answers: Sind die Antworten des Anwenders bei der Ausführung des Suchalgorithmus.
     * @param user: Ist das Nutzerobjekt des Anwenders.
     */
    constructor(answers, user) {
        if(new.target === FabscheAlgorithm) {
            throw new TypeError("You can not construct an object of this class, because it is abstract");
        }

        if(this.getOutfitColors === undefined) {
            throw new TypeError("Your subclass need to implement the method getOutfitColors");
        }

        FabscheAlgorithm.prototype.answers = answers;
        FabscheAlgorithm.prototype.user = user;
        FabscheAlgorithm.prototype.martianColorHandler = new MartianColorHandler();
    }

    //-------------------------------------------------------------------------
    // Constants

    /**
     * Das sind die derzeit verfügbaren Suchoptionen (SHIRT ist bisher nur implementiert).
     *
     * @returns {{TROUSERS: number, JACKET: number, SHIRT: number, SHOES: number}}
     */
    static get SEARCH_OPTIONS() {
        return {
            SHIRT: 0,
            TROUSERS: 1,
            SHOES: 2,
            JACKET: 3
        }
    }

    //-------------------------------------------------------------------------
    // Convenience methods

    /**
     * Filters die übergebene Menge an Farben (HEX-Werte) anhand der Präferenz von Sättigung
     * und Helligkeit.
     *
     * @param colors: Menge an HEX-Werten
     * @param prefersSaturation: boolean, ob der Anwender gesättigte Farben präferiert
     * @param prefersLightColors: boolean, ob der Anwender helle Farben präferiert
     * @returns {[]}
     */
    static filterOutBySaturationOrByLightness(colors, prefersSaturation, prefersLightColors) {
        let filteredColors = [];

        if(prefersSaturation !== null) {
            colors.forEach(color => {
                let martianColor = this.prototype.martianColorHandler.findColorByHex(color);
                let value = this.prototype.martianColorHandler.getValueOfColor(martianColor, true);
                let saturation = this.prototype.martianColorHandler.getSaturationOfColor(martianColor, true);


                if(prefersSaturation && saturation >= 50 && value < 80) {
                    filteredColors.push(color);
                } else if(!prefersSaturation && saturation >= 90 && value >= 80) {
                    filteredColors.push(color);
                }
            })
        } else if(prefersLightColors !== null) {
            colors.forEach(color => {
                let brightness = TinyColor(color).getBrightness(); //Tiny isDark and isLight doesn't work very well

                if(prefersLightColors && brightness >= 80 || !prefersLightColors && brightness < 80) {
                    filteredColors.push(color);
                }
            })
        } else {
            filteredColors = colors;
        }

        return filteredColors;
    }

    /**
     * Überprüft, ob der übergebene HEX-Wert in Garderobe vorhanden ist.
     *
     * @param colorHex: HEX-Wert der Farbe
     * @returns {boolean}
     */
    colorExistsInOutfit(colorHex) {
        let outfitColors = this.getOutfitColors();

        return jQuery.inArray(colorHex, outfitColors) >= 0;
    }

    //-------------------------------------------------------------------------
    // Getter/Setter

    /**
     * Abstrakte Funktion, welche die erbenden Klassen implementieren müssen.
     *
     * Die Funktion gibt eine Menge an HEX-Werten zurück, welche die Farben der der Garderobe darstellen.
     */
    getOutfitColors() {
        console.warn("You need to implement 'getOutfitColors' in your subclass!")

        return [];
    }

    //-------------------------------------------------------------------------
    //Functions for testing, will later be removed

    // /**
    //  * RAUSNEHMEN
    //  * Gibt ein Test-
    //  */
    // getDefaultAnswers() {
    //     return {
    //         trousers: "#002c66",
    //         shoes: "#ffffff",
    //         jacket: "#5e2f00", // Hex-Wert oder null, falls der Benutzer keine Jacke trägt
    //
    //         wantToStandOut: false,
    //         focusEyeColor: false, // true, false, null
    //         preferSaturatedColors: false, //true, false, null
    //         preferLightColors: false //true, false, null
    //     }
    // }
    //
    // getDefaultUserInformation() {
    //     return new User (
    //         1,
    //         "#8D5524",      //light: #E1C699, dark: #8D5524
    //         "#0000ff",      // Hex: Blau(#0000ff), Grün(#00bf00), Braun(#a65300) TODO Sollen auch die Unterfarben betrachtet werden?
    //         "",
    //         [
    //             "#000000",
    //             "#ffffff",
    //             "#00d4ff",
    //             "#a10000"
    //         ],
    //         [
    //             "#a65300",
    //             "#ff8000",
    //             "#ffff00"
    //         ]
    //     )
    // }
}

