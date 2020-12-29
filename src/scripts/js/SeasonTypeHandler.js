import seasonTypes from '../../../FabscheAlgorithmus/src/resources/SeasonTypeData'

/*
 * Im Rahmen der Identifizierung des Typs werden dem Anwender Fragen zu äußerlichen Merkmalen und Präferenzen gestellt.
 * Der SeasonTypeHandler ermittelt anhand der gegebenen Daten den Typ des Anwenders. Grundlage ist der von Zalando
 * implementierte Algorithmus, welcher auf der Theorie des Vier-Farbtyp-Systems basiert.
 */
class SeasonTypeHandler {

    /**
     * Generiert die Antwortmöglichkeiten für die Selektion der Hautfarbe oder deren Spezifikation
     *
     * answers bei index 0 --> (Grund-) Augenfarbe
     * answers bei index 1 --> (Spezifikation) Augenfarbe
     * answers bei index 2 --> (Grund-) Haarfarbe
     * answers bei index 3 --> (Spezifikation) Haarfarbe
     * answers bei index 4 --> Hautton
     *
     * @param answers
     */
    static getSelectableForSkinTone(answers) {
        let firstEyeColors = ["0", "2", "5", "8"];
        let secondEyeColors = ["1", "3", "4", "6", "7"]

        let firstHairColors = ["0", "1", "8", "10", "11", "12"];
        let secondHairColors = ["2", "3", "4", "5", "6", "7", "9", "13"];

        let eyeColor = answers[1];
        let hairColor = answers[3];
        let selectables;

        if (firstEyeColors.includes(eyeColor) && firstHairColors.includes(hairColor)) {
            selectables = [{
                "key": "eher Rosig",
                "value": "0",
                "options": [{
                    "key": "Haut wird braun, mit Sonnenbrand",
                    "value": "0",
                }, {"key": "Haut wird braun, ohne Sonnenbrand", "value": "1"}]
            }, {
                "key": "eher Beige",
                "value": "1",
                "options": [{
                    "key": "Haut wird braun, mit Sonnenbrand",
                    "value": "0",
                }, {"key": "Haut wird braun, ohne Sonnenbrand", "value": "1"}]
            }];
        } else if (secondEyeColors.includes(eyeColor) && secondHairColors.includes(hairColor)) {
            selectables = [{
                "key": "eher Rosig",
                "value": "0",
                "options": [{
                    "key": "Schnell braun, mit goldgelber Bräunung",
                    "value": "2",
                }, {"key": "Bräunt fast nicht, neigt zu Sommersprossen", "value": "3"}]
            }, {
                "key": "eher Beige",
                "value": "1",
                "options": [{
                    "key": "Schnell braun, mit goldgelber Bräunung",
                    "value": "2",
                }, {"key": "Bräunt fast nicht, neigt zu Sommersprossen", "value": "3"}]
            }];
        } else {
            selectables = [{
                "key": "eher Rosig",
                "value": "0",
                "options": [{
                    "key": "Haut wird braun, mit Sonnenbrand",
                    "value": "0",
                }, {"key": "Haut wird braun, ohne Sonnenbrand", "value": "1"}]
            }, {
                "key": "eher Beige",
                "value": "1",
                "options": [{
                    "key": "Schnell braun, mit goldgelber Bräunung",
                    "value": "2",
                }, {"key": "Bräunt fast nicht, neigt zu Sommersprossen", "value": "3"}]
            }];
        }

        return selectables;
    }

    /**
     * Identifiziert den Farbtyp anhand der Antworten
     *
     * @param answers
     */
    static getSeasonTypeForParams(answers) {
        let skinTone = answers["skinColor"][1];
        let seasonType = null;

        switch(skinTone) {
            case "0":
                seasonType = 1; // summer
                break
            case "1":
                seasonType = 3; // winter
                break
            case "2":
                seasonType = 0; // spring
                break
            case "3":
                seasonType = 2; // autumn
                break
        }

        return seasonType;
    }

    /**
     * Gibt den Farbtyp anhand der übergebenen Id zurück.
     *
     * @param typeId --> Id of the season type
     */
    static getSeasonTypeObject(seasonTypeId) {
        let seasonTypeObject = {};

        for(let i = 0; i < seasonTypes.length; i++) {
            let examinedObject = seasonTypes[i];

            if(seasonTypeId === examinedObject["id"]) {
                seasonTypeObject = examinedObject;
                break;
            }
        }

        return seasonTypeObject;
    }
}

export default SeasonTypeHandler;