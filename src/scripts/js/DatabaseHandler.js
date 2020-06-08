import AsyncStorage from "@react-native-community/async-storage";

class DatabaseHandler {

    static storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
            console.log(`Successfully set item to database: key ${key}, value ${value}`);
        } catch(e) {
            console.log(`Store data threw an exception: ${e}`);
        }
    }

    static storeObject = async (key, value) => {
        try {
            let objString = JSON.stringify(value);
            await AsyncStorage.setItem(key, objString);
            console.log(`Successfully set item to database: key ${key}, value ${objString}`);
        } catch(e) {
            console.log(`Store data threw an exception: ${e}`);
        }
    }

    static getData = async (key) => {
        let data = null;

        try {
            data = await AsyncStorage.getItem(key);

            if(data !== null) {
                console.log(`Found value for key ${key} : value ${data}`)
            }

        } catch(e) {
            console.log(`Get data threw an exception: ${e}`);
        }

        return data;
    }

    static getDataObject = async (key) => {
        let dataObject = null;

        try {
            const value = await AsyncStorage.getItem(key);

            if(value !== null) {
                dataObject = JSON.parse(value);
            }
        } catch(e) {
            console.log(`Get data threw an exception: ${e}`);
        }

        return dataObject;
    }

    static keyExists = async (key) => {
        DatabaseHandler.getData(key).then((result) => {
            return result === null;
        })
    }

    static removeAppsKeys = async () => {
        try {
            const keys = await DatabaseHandler.getAllKeys();

            if(keys.length > 0) {
                await AsyncStorage.multiRemove(keys);
                console.log(`Removed all apps keys ${keys}`);
            }
        } catch(e) {
            console.log(`Remove all apps keys threw an exception: ${e}`);
        }
    }

    static getAllKeys = async () => {
        let keys = [];

        try {
            keys = await AsyncStorage.getAllKeys();
        } catch(e) {
            console.log(`Get all keys threw an exception: ${e}`);
        }

        return keys;
    }

}

export default DatabaseHandler;