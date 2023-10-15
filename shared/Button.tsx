import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from "@/colors/Colors";

type ButtonPropsType = {
    title:string
    onButtonPress:()=>void
}

const Button = ({title, onButtonPress}:ButtonPropsType) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.yellow,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default Button;