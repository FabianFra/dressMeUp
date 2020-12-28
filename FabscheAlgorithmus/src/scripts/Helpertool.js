import LoggingTool from "./LoggingTool.js";

const hexRegex = /#[0-9a-f]{1,6}/g

/*
 * Die Klasse beinhaltet allgemeingültige Hilfsfunktionen.
 */
export default class HelperTool {

    /**
     * Fügt zwei eindimensionale Arrays zusammen.
     *
     * @param firstArray: Eine eindimensionale Menge
     * @param secondArray: Eine eindimensionale Menge
     * @param excludeDuplicates: Sollen Duplikate inkludiert werden (Default = false)
     * @param keepOrder: Soll die Reihenfolge beibehaltet werden (Default = true)
     */
    static mergeArrays(firstArray, secondArray, excludeDuplicates, keepOrder) {
        let mergedArray = [];

        if(this.isIterable(firstArray) && this.isIterable(secondArray)) {
            let childArray;

            if(!this.isDeclaredAndNotNull(excludeDuplicates)) {
                excludeDuplicates = false;
            }

            if(keepOrder) {
                mergedArray = [...firstArray];
                childArray = secondArray;
            } else {
                mergedArray = firstArray.length >= secondArray.length ? [...firstArray] : [...secondArray];
                childArray = firstArray.length >= secondArray.length ? secondArray : firstArray;
            }

            childArray.forEach(element => {
                if(excludeDuplicates) {
                    if(HelperTool.inArray(element, mergedArray) < 0) {
                        mergedArray.push(element);
                    }
                } else {
                    mergedArray.push(element);
                }
            })
        } else {
            LoggingTool.printWarn("mergeArray: Couldn't merge arrays because either the parameter firstArray or secondArray isn't iterable.")
        }

        return mergedArray;
    }

    /**
     * Gibt eine Zufallszahl zurück.
     *
     * @param max: Stellt den maximalen Wert dar.
     * @param includeZero: Soll der Wert 0 inkludiert werden (Default = false)
     * @param uniqueIn: Stellt eine Menge dar, in welche die generierte Zahl einzigartig sein soll
     * @returns {number}
     */
    static getRandomInt(max, includeZero, uniqueIn) {
        let randomInt;
        let iterations = 0;

        do {
            if(includeZero) {
                randomInt = Math.floor(Math.random() * Math.floor(max));
            } else {
                randomInt = Math.floor(Math.random() * Math.floor(max)) + 1;
            }

            iterations++;
        } while((HelperTool.isDeclaredAndNotNull(uniqueIn) && iterations <= 100 && HelperTool.inArray(randomInt, uniqueIn)))

        if(iterations === 100) {
            LoggingTool.printError(`Couldn't create a random value for max: ${max}, includeZero ${includeZero}, uniqueIn: ${JSON.stringify(uniqueIn)}`)
        }

        return randomInt;
    }

    /**
     * Überprüft, ob der Parameter deklariert wurde
     *
     * @param parameter
     */
    static isDeclared(parameter) {
        return typeof parameter !== "undefined";
    }

    /**
     * Überprüft, ob der Parameter einen Wert hat, welcher ungleich 'null' ist
     *
     * @param parameter
     */
    static isDeclaredAndNotNull(parameter) {
        return parameter != null;
    }

    /**
     * Überprüft, ob der Parameter eine Länge von 0 besitzt
     *
     * @param parameter
     * @returns {boolean}
     */
    static isEmpty(parameter) {
        let isEmpty = false;

        if(this.isDeclaredAndNotNull(parameter)) {
            isEmpty = parameter.length === 0;
        }

        return isEmpty;
    }

    /**
     * Überprüft, ob der übergebene Parameter iterierbar ist.
     *
     * @param parameter
     * @returns {boolean}
     */
    static isIterable(parameter) {
        let isIterable = false;

        if(this.isDeclaredAndNotNull(parameter)) {
            isIterable = typeof parameter[Symbol.iterator] === 'function';
        }

        return isIterable;
    }

    /**
     * Überprüft ob der Parameter dem HEX-Format entspricht.
     *
     * @param parameter
     * @returns {*|Promise<Response | undefined>|RegExpMatchArray|boolean}
     */
    static isHex(parameter) {
        let isHex = false;

        if(this.isDeclaredAndNotNull(parameter) && typeof parameter === 'string') {
            let match = parameter.match(hexRegex);
            isHex = match && parameter === match[0];
        }

        return isHex;
    }

    /**
     * Überprüft, ob der übergebene Wert in der übergebenen Menge enthalten ist.
     *
     * @param value: Wert der überprüft werden soll
     * @param array: Menge an Werten
     * @param hierarchySearch: Soll ein hierarchische Suche ausgegeführt werden (Mengen in Mengen)
     * @param typeSafe: Soll die Suche case-sensitive sein (Default false)
     * @returns {boolean}
     */
    static isInArray(value, array, hierarchySearch, typeSafe) {
        return this.inArray(value, array, hierarchySearch, typeSafe) >= 0;
    }

    /**
     * Gibt den Index des übergebenen Wertes innerhalb der Menge zurück.
     *
     * Falls der Wert nicht in der Menge vorhanden ist, so wird der Zahlenwert -1 zurückgegeben.
     *
     * @param value: Wert der überprüft werden soll
     * @param array: Menge an Werten
     * @param hierarchySearch: Soll ein hierarchische Suche ausgegeführt werden (Mengen in Mengen, Default false)
     * @param typeSafe: Soll die Suche case-sensitive sein (Default false)
     * @returns {number}
     */
    static inArray(value, array, hierarchySearch, typeSafe) {
        let result = -1;

        if(!HelperTool.isDeclaredAndNotNull(hierarchySearch)) {
            hierarchySearch = false;
        }

        if(!HelperTool.isDeclaredAndNotNull(typeSafe)) {
            typeSafe = false;
        }

        if(this.isDeclared(value) && this.isIterable(array)) {
            for(let i = 0; i < array.length; i++) {
                let iteration = array[i];

                if(hierarchySearch && Object.prototype.toString.call(iteration) === '[object Array]') {
                    result = this.inArray(value, iteration, hierarchySearch, typeSafe);
                } else if ((typeSafe && value === iteration || (!typeSafe && value == iteration))) {
                    result = i;
                }

                if(result !== -1) {
                    break;
                }
            }
        } else {
            LoggingTool.printError(`One or more parameter(s) is/are invalid value: ${value}, array: ${array}`);
        }

        return result;
    }
}

if(typeof window !== "undefined" && typeof window["HelperTool"] === "undefined") {
    window["HelperTool"] = HelperTool;
}