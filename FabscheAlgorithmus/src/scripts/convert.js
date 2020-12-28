function test() {
    let martianColors = jQuery.extend(true, {}, martianColor.getMartianColors());

    for(const [key, value] of Object.entries(martianColors)) {
        console.log(`${key} + ${JSON.stringify(value)}`);

        if(value.representative) {
            let representative = value.representative;
            let converted = convertObject(representative);
            value.representative = converted;
        }

        if(value.shades) {
            let shades = value.shades;
            let converted = convertObject(shades);
            value.shades = converted;
        }

        if(value.tints) {
            let tints = value.tints;
            let converted = convertObject(tints);
            value.tints = converted;

        }

        if(value.achromatic) {
            let achromatic = value.achromatic;
            let converted = convertObject(achromatic);
            value.achromatic = converted;
        }

    }

    console.log(martianColors);
}

function convertObject(colorObj) {
    console.log("Convert " + JSON.stringify(colorObj));
    let converted = [];

    colorObj.forEach(color =>  {
        let newObj = {name: color.name, nameI18N: color.nameI18N};

        newObj.hsv = color.hsv;
        newObj.rgb = getRgbFromHsv(newObj.hsv);
        newObj.hex = getHexFromHsv(newObj.hsv);

        converted.push(newObj)
    })

    return converted;
}

function getHexFromHsv(hsvString) {
    let color = tinycolor(hsvString);
    return color.toHexString()
}

function getRgbFromHsv(hsvString) {
    let color = tinycolor(hsvString);
    return color.toRgbString()
}