import seasonTypes from '../../resources/data/seasonTypes.json';

class SeasonTypeAlgorithm {

    /**
     * params at index 0 --> (Grund-) Augenfarbe
     * params at index 1 --> (Spezifikation) Augenfarbe
     * params at index 2 --> (Grund-) Haarfarbe
     * params at index 3 --> (Spezifikation) Haarfarbe
     * params at index 4 --> Hautton
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
     * params at index 0 --> (Grund-) Augenfarbe
     * params at index 1 --> (Spezifikation) Augenfarbe
     * params at index 2 --> (Grund-) Haarfarbe
     * params at index 3 --> (Spezifikation) Haarfarbe
     * params at index 4 --> Hautton
     * params at index 5 --> Zusätzliche Informationen
     * @param answers
     */
    static getSeasonTypeForParams(answers) {
        console.log("getSeasonTypeForParams: " + answers);
        let skinTone = answers["skinColor"][1];
        let seasonType = null;

        switch(skinTone) {
            case "0":
                seasonType = "summer";
                break
            case "1":
                seasonType = "winter";
                break
            case "2":
                seasonType = "spring";
                break
            case "3":
                seasonType = "autumn";
                break
        }

        return seasonType;
    }

    /**
     *
     * @param typeId --> Id of the season type
     */
    static getSeasonTypeObject(seasonTypeName) {
        let seasonTypeObject = {};
        seasonTypeName = seasonTypeName.toLowerCase();

        for(let i = 0; i < seasonTypes.length; i++) {
            let examinedObject = seasonTypes[i];

            if(seasonTypeName === examinedObject.name.toLowerCase()) {
                seasonTypeObject = examinedObject;
                break;
            }
        }

        return seasonTypeObject;
    }

    analyseData(jsonObject, searchString, seasonType) {
        let counter = 0
        let result = {"results": [], "counter": 0};
        searchString = searchString.toLowerCase();

        jsonObject.forEach(element => {
            let paramString = element.params.join(">").toLowerCase();
            console.log(paramString)
            if (seasonType && seasonType.toLowerCase() === element.type.toLowerCase() && paramString.includes(searchString)) {
                result.results.push(element.params + "|" + element.type)
                result.counter++;
            } else if (paramString.includes(searchString)) {
                result.results.push(element.params + "|" + element.type)
                result.counter++;
            }
        })

        return result
    }

}

export default SeasonTypeAlgorithm;