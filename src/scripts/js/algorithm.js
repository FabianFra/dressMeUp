let params = ["Blau", "Reines Blau", "Blond", "Hellblond", "eher beige", "Schnell braun mit goldgelber Bräunung"];

class Test123 {

    /**
     * params at index 0 --> (Grund-) Augenfarbe
     * params at index 1 --> (Spezifikation) Augenfarbe
     * params at index 2 --> (Grund-) Haarfarbe
     * params at index 3 --> (Spezifikation) Haarfarbe
     * params at index 4 --> Hautton
     * @param answers
     */
    getSelectableForSkinTone(answers) {
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
                "hex": "#e8d5ce",
                "options": [{
                    "key": "Haut wird braun, mit Sonnenbrand",
                    "value": "0",
                    "hex": "#ffffff"
                }, {"key": "Haut wird braun, ohne Sonnenbrand", "value": "1", "hex": "#ffffff"}]
            }, {
                "key": "eher Beige",
                "value": "1",
                "hex": "#dbbfa3",
                "options": [{
                    "key": "Haut wird braun, mit Sonnenbrand",
                    "value": "0",
                    "hex": "#ffffff"
                }, {"key": "Haut wird braun, ohne Sonnenbrand", "value": "1", "hex": "#ffffff"}]
            }];
        } else if (secondEyeColors.includes(eyeColor) && secondHairColors.includes(hairColor)) {
            selectables = [{
                "key": "eher Rosig",
                "value": "0",
                "hex": "#e8d5ce",
                "options": [{
                    "key": "Schnell braun, mit goldgelber Bräunung",
                    "value": "2",
                    "hex": "#ffffff"
                }, {"key": "Bräunt fast nicht, neigt zu Sommersprossen", "value": "3", "hex": "#ffffff"}]
            }, {
                "key": "eher Beige",
                "value": "1",
                "hex": "#dbbfa3",
                "options": [{
                    "key": "Schnell braun, mit goldgelber Bräunung",
                    "value": "2",
                    "hex": "#ffffff"
                }, {"key": "Bräunt fast nicht, neigt zu Sommersprossen", "value": "3", "hex": "#ffffff"}]
            }];
        } else {
            selectables = [{
                "key": "eher Rosig",
                "value": "0",
                "hex": "#e8d5ce",
                "options": [{
                    "key": "Haut wird braun, mit Sonnenbrand",
                    "value": "0",
                    "hex": "#ffffff"
                }, {"key": "Haut wird braun, ohne Sonnenbrand", "value": "1", "hex": "#ffffff"}]
            }, {
                "key": "eher Beige",
                "value": "1",
                "hex": "#dbbfa3",
                "options": [{
                    "key": "Schnell braun, mit goldgelber Bräunung",
                    "value": "2",
                    "hex": "#ffffff"
                }, {"key": "Bräunt fast nicht, neigt zu Sommersprossen", "value": "3", "hex": "#ffffff"}]
            }];
        }

        return selectables;
    }


    getSeasonTypesForParams(jsonObject) {
        let counter = 0;

        for (let i = 0; i < jsonObject.length; i++) {
            let element = jsonObject[i];

            let params = element.params;
            let selectables = (generateTeintSelectables(params[1].toLowerCase(), params[3].toLowerCase()))

            if (params[4] === "eher Beige" && selectables.includes("Haut wird braun, mit Sonnenbrand")) {
                console.log("Found element :: " + params);
                counter++;
            }
        }

        console.log("Found " + counter);
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


    /**
     * params at index 0 --> (Grund-) Augenfarbe
     * params at index 1 --> (Spezifikation) Augenfarbe
     * params at index 2 --> (Grund-) Haarfarbe
     * params at index 3 --> (Spezifikation) Haarfarbe
     * params at index 4 --> Hautton
     * params at index 5 --> Bräunung + Sonnenbrand/Sommersprossen
     * @param params
     */
    analyseColorType(params) {

    }

    /**
     *
     * @param eyeColor
     * @param hairColor
     */
    generateTeintSelectables(eyeColor, hairColor) {
        let eyeColors = ["reines blau", "blaugrün", "grüngrau", "schwarzbraun"];
        let hairColors = ["hellblond", "aschblond", "hellbraun", "schwarzbraun", "schwarz", "blauschwarz"];
        let selectables;

        if (eyeColors.includes(eyeColor) && hairColors.includes(hairColor)) {
            selectables = ["Haut wird braun, mit Sonnenbrand", "Haut wird braun, ohne Sonnebrand"];
        } else {
            selectables = ["Bräunt fast nicht, neigt zu Sommersprossen", "Schnell braun, mit goldgelber Bräunung"]
        }

        return selectables;
    }
}

export default Test123;