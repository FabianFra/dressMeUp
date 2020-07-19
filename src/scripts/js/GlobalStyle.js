import { StyleSheet } from 'react-native';

const colors = {
    primaryColor: '#2b3940',
    secondaryColor: '#ffffff'
}

const styles = StyleSheet.create({
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
        marginLeft: 10
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

        padding: 10
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
    }
})

module.exports = styles;