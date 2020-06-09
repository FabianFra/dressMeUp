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

        paddingTop: 25
    },
    commonButton: {
        width: '40%',
        alignItems: 'center',
        padding: 10,
        backgroundColor:  colors.primaryColor,
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
        fontFamily: 'Roboto'
    },
    commonSquare: {
        width: 50,
        height: 50,
        marginRight: 25,
        marginBottom: 25
    }
})

module.exports = styles;