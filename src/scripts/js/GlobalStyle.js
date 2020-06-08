import { StyleSheet } from 'react-native';

const colors = {
    white: {

    },
    dark: {
        primaryColor: '#2b3940',
        secondaryColor: '#ffffff'
    }
}

const defaults = {
    white: {

    },
    dark: {
        button: {
            width: '60%',
            alignItems: 'center',
            padding: 10,
            buttonBackGroundColor:  colors.dark.primaryColor,
            borderWidth: 1,
            borderColor: colors.dark.secondaryColor,
            borderRadius: 10
        },
        text: {
            color: colors.dark.secondaryColor,
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'Roboto'
        }
    }
}

const styles = StyleSheet.create({
    commonButton: {
        alignItems: defaults.dark.button.alignItems,
        width: defaults.dark.button.width,
        padding: defaults.dark.button.padding,
        backgroundColor: defaults.dark.button.buttonBackGroundColor,

        borderWidth: defaults.dark.button.borderWidth,
        borderColor: defaults.dark.button.borderColor,
        borderRadius: defaults.dark.button.borderRadius
    },
    commonText: {
        color: defaults.dark.text.color,
        fontSize: defaults.dark.text.fontSize,
        fontWeight: defaults.dark.text.fontWeight,
        fontFamily: defaults.dark.text.fontFamily
    }
})

module.exports = styles;