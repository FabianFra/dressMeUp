import SeasonTypeData from "../resources/seasonTypeData.js"

import HelperTool from "./Helpertool.js";
import LoggingTool from "./LoggingTool.js";

export default class User {

    //----------------------------------------------------------------------------------------------------------
    // Constructor(s)

    constructor(seasonTypeId, skinColor, eyeColor, hairColor, desirableColors, undesirableColors) {
        this.skinColor = skinColor;
        this.eyeColor = eyeColor;
        this.hairColor = hairColor;
        this.desirableColors = [].concat(desirableColors);
        this.undesirableColors = [].concat(undesirableColors);
        this._assignSeasonType(seasonTypeId)
        this._finalizeInitialization();
    }

    _finalizeInitialization() {
        this._orderPreferredColorsByMatchingColorsOfTheSeasonType();
    }

    //----------------------------------------------------------------------------------------------------------
    // Convenience methods

    desiresColor(color) {
        return HelperTool.inArray(color, this.desirableColors) >= 0;
    }

    postponesColor(color) {
        return HelperTool.inArray(color, this.undesirableColors) >= 0;
    }

    isSeasonTypeColor(color) {
        return HelperTool.inArray(color, this.seasonTypeMatchingColors) >= 0;
    }

    //----------------------------------------------------------------------------------------------------------
    // private methods

    _assignSeasonType(seasonTypeId) {
        let seasonType = SeasonTypeData.filter(seasonType => {
            return seasonType.id === seasonTypeId;
        })

        if(!HelperTool.isEmpty(seasonType)) {
           if(seasonType.length === 1) {
                this.seasonType = seasonType[0];
                this.seasonTypeMatchingColors = this.seasonType["matchingColors"];
           } else {
               LoggingTool.printError(`More than one season type found for id ${seasonTypeId}`);
           }
        } else {
            LoggingTool.printError(`No season type found for id ${seasonTypeId}`)
        }
    }

    /**
     * Die präferierten Farben des Benutzers werden hier sortiert nach den Farben, welche zu seinem/ihrem Farbtyp passen.
     * @returns {*[]}
     */
    _orderPreferredColorsByMatchingColorsOfTheSeasonType() {
        let sortedArray = [];

        if(HelperTool.isDeclaredAndNotNull(this.desirableColors) && !HelperTool.isEmpty(this.desirableColors)) {
            this.desirableColors.forEach(wantedColor => {
                if(this.isSeasonTypeColor(wantedColor)) {
                    sortedArray.unshift(wantedColor);
                } else {
                    sortedArray.push(wantedColor);
                }
            })

            if (sortedArray.length === 0) {
                LoggingTool.printWarn("No preferred color matches with the matching colors of the user's season type")
                this.desirableColors = []
            }
        } else {
            LoggingTool.printLog("The user doesn't have desirable colors, hence the season type colors wasn't sorted")
            this.desirableColors = [];
        }
    }
}

if(typeof window !== "undefined" && typeof window["dmuUser"] === "undefined") {
    window["dmuUser"] = User;
}