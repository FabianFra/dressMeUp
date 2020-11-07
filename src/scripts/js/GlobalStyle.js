import { StyleSheet } from 'react-native';

const colors = {
    primaryColor: '#2b3940',
    secondaryColor: '#ffffff'
}

const styles = StyleSheet.create({
    commonAllContainer: {
        flex: 1,
        backgroundColor: '#2b3940',
    },
    commonContainer: {
        flex: 1,
        backgroundColor: '#2b3940',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
    },
    commonButton: {
        width: '40%',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.primaryColor,
        borderWidth: 1,
        borderColor: colors.secondaryColor,
        borderRadius: 10,
        marginHorizontal: 10
    },
    commonButtonAngled: {
        width: '40%',
        height: 33,
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.primaryColor,
        borderTopWidth: 1,
        borderTopColor: colors.secondaryColor,
    },
    commonText: {
        color: colors.secondaryColor,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto'
    },
    commonTitle: {
        color: '#f5f6f7',
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
    commonSquare: {
        width: 50,
        height: 50,
        marginRight: 25,
        marginBottom: 25
    },
    commonModal: {
        backgroundColor: '#2b3940',
        padding: 10,
        height: '100%',
        width: '100%'
    },
    commonShadow: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10
    },

    disabled: {
        opacity: 0.5
    },

    mainMenuContainer: {
        backgroundColor: colors.primaryColor,
        flex: 1,
        justifyContent: "center",
        flexDirection: "column"
    },

    mainMenuButton: {
        backgroundColor: colors.primaryColor,
        flex: 0.33,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,

        borderWidth: 1,
        borderColor: colors.secondaryColor,
        borderRadius: 10
    },

    colorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    colorSquare: {
        width: 130,
        height: 130,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10
    },

    colorSquareContentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    colorSquareText: {
        color: 'white',
        margin: 10,
        textAlign: 'center'
    },

    submitButton: {
        marginBottom: 15,
        width: "100%",
    }
})

module.exports = styles;