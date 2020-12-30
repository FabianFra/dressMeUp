const loggingIsActive = true;

const showLog = false;
const showDebug = false;
const showWarn = true;
const showError = true;

/*
 * Die Klasse dient für jegliche (Konsolen-)Ausgaben in der Anwendung.
 *
 */
export default class LoggingTool {

    //-------------------------------------------------------------------------
    // Constants

    /**
     * Stellt die verschiedenen Nachrichtentypen dar.
     *
     * @returns {{LOG: string, ERROR: string, DEBUG: string, WARN: string}}
     * @constructor
     */
    static get MESSAGE_TYPE() {
        return {
            LOG: '0',
            DEBUG: '1',
            WARN: '2',
            ERROR: '3'
        }
    }

    //-------------------------------------------------------------------------
    //Convenience methods

    /**
     * Schreibt die übergebene Nachricht
     *
     * @see https://developer.mozilla.org/de/docs/Web/API/Console
     *
     * @param message: Hauptinhalt der Nachricht
     * @param type: Typ der Nachricht (siehe MESSAGE_TYPE)
     * @param additional: Zusätzlicher Inhalt der Nachricht
     */
    static printMessage(message, type, additional) {
        if(loggingIsActive) {
            if(type === LoggingTool.MESSAGE_TYPE.LOG && showLog) {
                additional ? console.log(message, additional) : console.log(message);
            } else if(type === LoggingTool.MESSAGE_TYPE.DEBUG && showDebug) {
                additional ? console.debug(message, additional) : console.debug(message);
            } else if(type === LoggingTool.MESSAGE_TYPE.WARN && showWarn) {
                additional ? console.warn(message, additional) : console.warn(message);
            } else if(type === LoggingTool.MESSAGE_TYPE.ERROR && showError) {
                additional ? console.error(message, additional) : console.error(message);
            }
        }
    }

    /**
     * Schreibt ein normales log in die Konsole.
     *
     * @param message
     * @param additional
     */
    static printLog(message, additional) {
        this.printMessage(message, this.MESSAGE_TYPE.LOG, additional);
    }

    /**
     * Schreibt ein debug log in die Konsole.
     * @param message
     * @param additional
     */
    static printDebug(message, additional) {
        this.printMessage(message, this.MESSAGE_TYPE.DEBUG, additional);
    }

    /**
     * Schreibt ein warn log in die Konsole.
     * @param message
     * @param additional
     */
    static printWarn(message, additional) {
        this.printMessage(message, this.MESSAGE_TYPE.WARN, additional);
    }

    /**
     * Schreibt ein error log in die Konsole.
     * @param message
     * @param additional
     */
    static printError(message, additional) {
        this.printMessage(message, this.MESSAGE_TYPE.ERROR, additional);
    }

}