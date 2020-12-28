(function () {
    if (!window.colorHandler) window.colorHandler = function ($) {

        const hueSpaces = [0, 30, 42, 50, 60, 65, 76, 87, 120, 147, 160, 172, 180, 190, 200, 214, 240, 267, 280, 290, 300, 310, 320, 333];
        let martianColors = {};

        const colorMatchingPatternOne = /({"(\w+\s?-?\w?)+":{"i18N":"(\w+\s?-?\w?)+","hue":\d{1,3},"saturation":\d{1,3},"intensity":\d{1,3}}})/g;
        const colorMatchingPatternTwo = /({"i18N":"(\w+\s?-?\w?)+","hue":\d{1,3},"saturation":\d{1,3},"intensity":\d{1,3}}})/g

        let ColorHandler = {

            //TODO ADD schwarz und weiß
            initializeMartianColors : async function(){
                $.getJSON("../resources/martianColors.json", function(data) {
                    console.log("Get json successfully executed");
                    martianColors = data;
                })
            },

            /**
             * Get all colors of the martian color wheel as object
             * @returns {{}}
             */
            getMartianColors : function () {
                return martianColors;
            },

            /**
             * Get all primary colors of the martian wheel, which includes 'Additive Primary Color' and 'Subtractive Primary Color'
             * @returns {primaryColors[]}
             */
            getPrimaryColors : function () {
                let martianColors = this.getMartianColors();

                return Object.values(martianColors).filter(obj => obj.identifier === "Additive Primary Color" || obj.identifier === "Subtractive Primary Color")
            },

            /**
             * Get all achromatic colors which isn't included in the martian wheel.
             * @returns {*}
             */
            getAchromaticColors : function () {
                return martianColors[0].achromatic;
            },

            /**
             * Get all 'Additive Primary Color' colors of the martian color wheel (red, blue, green)
             * @returns {unknown[]}
             */
            getAdditivePrimaryColors : function () {
                let martianColors = this.getMartianColors();

                return Object.values(martianColors).filter(obj => obj.identifier === "Additive Primary Color")
            },

            /**
             * Get all 'Subtractive Primary Color' colors of the martian color wheel (magenta, cyan, yellow)
             * @returns {unknown[]}
             */
            getSubtractivePrimaryColors : function () {
                let martianColors = this.getMartianColors();

                return Object.values(martianColors).filter(obj => obj.identifier === "Subtractive Primary Color")
            },

            /**
             * Get all secondary colors of the martian color wheel
             * @returns {unknown[]}
             */
            getSecondaryColors : function () {
                let martianColors = this.getMartianColors();

                return Object.values(martianColors).filter(obj => obj.identifier === "Secondary Color")
            },

            /**
             * Get all tertiary colors of the martian color wheel
             * @returns {unknown[]}
             */
            getTertiaryColors : function () {
                let martianColors = this.getMartianColors();

                return Object.values(martianColors).filter(obj => obj.identifier === "Tertiary Color")
            },

             /**
             * Get all shades of the given color object.
             * @param color
             * @returns {*[]}
             */
            getShadesOfHue : function (colorName) {
                let martianColors = this.getMartianColors();
                let shades = undefined;

                let color = Object.values(martianColors)
                    .filter(obj => obj.hue.toLowerCase() === colorName.toLowerCase())[0];

                if(typeof color === "undefined" || typeof color.shades === "undefined") {
                    console.warn(`No shades found for ${colorName}`);
                } else {
                    shades = color.shades;
                }

                return shades;
            },

            getTintsOfHue : function (colorName) {
                let martianColors = this.getMartianColors();
                let tints = undefined;

                let color = Object.values(martianColors)
                    .filter(obj => obj.hue.toLowerCase() === colorName.toLowerCase())[0];

                if(typeof color === "undefined" || typeof color.tints === "undefined") {
                    console.warn(`No shades found for ${colorName}`);
                } else {
                    tints = color.tints;
                }

                return tints;
            },

            getShadesAndTintsOfHue : function (colorName) {
                let martianColors = this.getMartianColors();
                let colorsOfHue = undefined;

                let colorObj = Object.values(martianColors)
                    .filter(obj => obj.hue.toLowerCase() === colorName.toLowerCase())[0];

                if (typeof colorObj === "undefined") {
                    console.warn("No color found for " + colorName);
                } else {
                    colorsOfHue = Object.assign({}, colorObj.representative, colorObj.shades, colorObj.tints)
                }

                return colorsOfHue;
            },

            /**
             * Expects a String including three digits. The first one is the hue, the second one the saturation
             * and the third one the value/brightness/intensity.
             *
             * If no color is found the user will be warned and undefined will be returned.
             * @param colorHsv
             */
            findColorByHsvStr : function(colorHsv) {
                let extractValues = colorHsv.match(/\d+/g);

                if(extractValues === null || extractValues.length !== 3) {
                    console.warn(`Incorrect hsv format, nothing found for ${colorHsv}`)
                    return undefined;
                }

                let hue = extractValues[0];
                let saturation = extractValues[1];
                let intensity = extractValues[2];

                return this.findColorByHsv(hue, saturation, intensity)
            },

            /**
             * Get the color of the martian color wheel with the given hue, saturation and intensity
             *
             * If no color is found the user will be warned and undefined will be returned.
             * @param colorHsv
             */
            findColorByHsv : function(hue, saturation, intensity) {
                let martianColors = this.getMartianColors();

                let hueFamily = martianColors[hue];
                let color = undefined;

                if(typeof hueFamily !== "undefined") {
                    let colors = Object.assign({}, hueFamily.representative, hueFamily.shades, hueFamily.tints, hueFamily.achromatic)

                    for(const [key, value] of Object.entries(colors)) {
                        if(value.saturation == saturation && value.intensity == intensity) {
                            color = {[key]: value};
                            break;
                        }
                    }
                }

                if(typeof color === "undefined") {
                    console.warn(`No color found for Hue = ${hue}, Saturation = ${saturation} and Intensity = ${intensity}`);
                }

                return color;
            },

            /**
             * Expects a String including the name of the wanted color.
             *
             * If no color is found the user will be warned and undefined will be returned.
             * @param colorHsv
             */
            findColorByName : function (colorName) {
                let martianColors = this.getMartianColors();
                let foundColor = undefined;

                colorName = colorName.toLowerCase();

                for(const [key, value] of Object.entries(martianColors)) {
                    let colors = Object.assign({}, value.representative, value.shades, value.tints, value.achromatic)

                    Object.keys(colors).forEach(key => {
                        if(colorName === key.toLowerCase()) {
                            foundColor = {[key]: colors[key]};
                        }
                    })

                    if(typeof foundColor !== "undefined") {
                        break;
                    }
                }

                if(typeof foundColor === "undefined") {
                    console.warn("No color found for " + colorName);
                }

                return foundColor;
            },


            /**
             * Converts the given color object to hsv string
             * @param colorObj
             */
            convertColorObjToHsv : function (colorObj) {
                let hsv = undefined;

                if(this.__validColorObject(colorObj)) {
                    hsv = this.convertColorToHsv(Object.values(colorObj)[0]);
                } else {
                    console.warn(`${colorObj} isn't formatted right`)
                }

                return hsv;
            },

            /**
             * Converts the given color to hsv string
             * @param color
             */
            convertColorToHsv : function(color) {
                let hsv = undefined;

                if(this.__validColor(color)) {
                    hsv = "hsv(" + color.hue + ", " + color.saturation + "%, " + color.intensity + "%)";
                }

                return hsv;
            },

            getColorsByHue : function(hue) {
                let colors = undefined;

                if(this.__hueExists(hue)) {
                    let martianColors = this.getMartianColors()[hue];
                    colors = Object.assign({}, martianColors.representative, martianColors.shades, martianColors.tints, martianColors.achromatic)
                }

                return colors;
            },

            /**
             * Check wether the two colors are equivalent. The expected format is {'i18N': value, 'hue': value, 'saturation': value, 'intensity': value,}
             * @param colorOne
             * @param colorTwo
             * @returns {boolean|boolean}
             */
            compareColors : function(colorOne, colorTwo) {

                if(typeof colorOne.i18N === "undefined" || typeof colorTwo.i18N === "undefined") {
                    console.warn(`One or both colors don't have a i18N :: ${JSON.stringify(colorOne)} and ${JSON.stringify(colorTwo)}`);
                    return false;
                }

                if(typeof colorOne.hue === "undefined" || typeof colorTwo.hue === "undefined") {
                    console.warn(`One or both colors don't have a hue :: ${JSON.stringify(colorOne)} and ${JSON.stringify(colorTwo)}`);
                    return false;
                }

                if(typeof colorOne.saturation === "undefined" || typeof colorTwo.saturation === "undefined") {
                    console.warn(`One or both colors don't have a saturation :: ${JSON.stringify(colorOne)} and ${JSON.stringify(colorTwo)}`);
                    return false;
                }

                if(typeof colorOne.intensity === "undefined" || typeof colorTwo.intensity === "undefined") {
                    console.warn(`One or both colors don't have an intensity :: ${JSON.stringify(colorOne)} and ${JSON.stringify(colorTwo)}`);
                    return false;
                }

                return colorOne.i18N === colorTwo.i18N &&
                       colorOne.hue === colorTwo.hue &&
                       colorOne.saturation === colorTwo.saturation &&
                       colorOne.intensity === colorTwo.intensity;
            },

            /**
             * Checks whether the given hue exists in the martian color wheel
             * @param hue
             * @returns {boolean}
             * @private
             */
            __hueExists : function(hue) {
                if(!hueSpaces.includes(parseInt(hue))) {
                    console.warn("No matching hue found for " + hue);
                    return false;
                } else {
                    return true;
                }
            },

            /**
             * Checks whether the given color object has the valid pattern
             * @param color
             * @returns {boolean|boolean}
             * @private
             */
            __validColorObject : function(colorObj) {
                let matcher = JSON.stringify(colorObj).match(colorMatchingPatternOne);

                return matcher !== null && matcher.length === 1;
            },

            /**
             * Checks whether the given color has the valid pattern
             * @param color
             * @returns {boolean|boolean}
             * @private
             */
            __validColor : function(color) {
                let matcher = JSON.stringify(color).match(colorMatchingPatternTwo);

                return matcher !== null && matcher.length === 1;
            },

            /**
             * Formats a color to a valid color object
             * @param color
             * @private
             */
            __formatToColorObject : function (color) {
                let colorStr = JSON.stringify(color);
                let matcher = colorStr.match(colorMatchingPatternTwo);
                let colorObj = undefined;

                if(matcher !== null && matcher.length === 1) {
                    let colorKey = color.i18N;
                    colorObj = {[colorKey]: color};
                } else {
                    console.warn(`Couldn't format ${colorStr} to a valid color object`);
                }

                return colorObj;
            }
        }

        /**
         * Function will be executed when the window is loaded and window.jQuery isn't undefined
         */
        $(window).on("load", async function() {
            if(window.jQuery){
                await ColorHandler.initializeMartianColors();
            } else {}
        });


        return ColorHandler;
    }(jQuery);
})();