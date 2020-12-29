import AsyncStorage from "@react-native-community/async-storage";
import LoggingTool from "../../../FabscheAlgorithmus/src/scripts/LoggingTool";

/*
 * Die Klasse DatabaseHandler ist die Schnittstelle für das Arbeiten mit dem Framework AsyncStorage. Es besitzt
 * Hilfsfunktionen, um Daten beziehungsweise Datenobjekte zu speichern und auszulesen. Des weiteren können Datensätze
 * auf ihre Existenz überprüft werden und gegebenenfalls gelöscht werden.
 *
 * @see https://github.com/react-native-async-storage/async-storage
 */
class DatabaseHandler {

    /**
     * Speichert ein Key-Value-Pair
     * @param key: Schlüssel des Eintrags
     * @param value: Wert des Eintrags
     * @returns {Promise<void>}
     */
    static storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
            LoggingTool.printDebug(`Successfully set item to database: key ${key}, value ${value}`);
        } catch(e) {
            LoggingTool.printWarn(`Store data threw an exception: ${e}`);
        }
    }

    /**
     * Speichert eine Key-Value-Pair. Das Value ist hierbei eine JavaScript Objekt
     * @param key: Schlüssel des Eintrags
     * @param value: Wert des Eintrags (JavaScript Objekt)
     * @returns {Promise<void>}
     */
    static storeObject = async (key, value) => {
        try {
            let objString = JSON.stringify(value);
            await AsyncStorage.setItem(key, objString);
            LoggingTool.printDebug(`Successfully set item to database: key ${key}, value ${objString}`);
        } catch(e) {
            LoggingTool.printWarn(`Store data threw an exception: ${e}`);
        }
    }

    /**
     * Gibt die Daten des Schlüssels zurück, falls der Eintrag gefunden werden kann.
     *
     * @param key: Schlüssel des Eintrags
     * @returns {Promise<null>}
     */
    static getData = async (key) => {
        let data = null;

        try {
            data = await AsyncStorage.getItem(key);

            if(data !== null) {
                LoggingTool.printDebug(`Found value for key ${key} : value ${data}`)
            }

        } catch(e) {
            LoggingTool.printWarn(`Get data threw an exception: ${e}`);
        }

        return data;
    }

    /**
     * Gibt die Daten des Schlüssels in Form eine JavaScript Objekts zurück, falls der Eintrag gefunden werden kann.
     * @param key: Schlüssel des Eintrags
     * @returns {Promise<null>}
     */
    static getDataObject = async (key) => {
        let dataObject = null;

        try {
            const value = await AsyncStorage.getItem(key);

            if(value !== null) {
                dataObject = JSON.parse(value);
            }
        } catch(e) {
            LoggingTool.printWarn(`Get data threw an exception: ${e}`);
        }

        return dataObject;
    }

    /**
     * Überprüft, ob ein Wert zu dem übergenen Schlüssel existiert.
     *
     * @param key: Schlüssel des Eintrags
     * @returns {Promise<void>}
     */
    static keyExists = async (key) => {
        DatabaseHandler.getData(key).then((result) => {
            return result === null;
        })
    }

    /**
     * Entfernt alle Einträge aus der Datenbank.
     * @returns {Promise<void>}
     */
    static removeAppsKeys = async () => {
        try {
            const keys = await DatabaseHandler.getAllKeys();

            if(keys.length > 0) {
                await AsyncStorage.multiRemove(keys);
                LoggingTool.printDebug(`Removed all apps keys ${keys}`);
            }
        } catch(e) {
            LoggingTool.printWarn(`Remove all apps keys threw an exception: ${e}`);
        }
    }

    /**
     * Gibt die Schlüssel der vorhandenen Einträge zurück.
     * @returns {Promise<[]>}
     */
    static getAllKeys = async () => {
        let keys = [];

        try {
            keys = await AsyncStorage.getAllKeys();
        } catch(e) {
            LoggingTool.printWarn(`Get all keys threw an exception: ${e}`);
        }

        return keys;
    }

}

export default DatabaseHandler;