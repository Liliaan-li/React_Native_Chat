import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useLocalSearchParams} from "expo-router";

const Page = () => {
    const {chatId} =useLocalSearchParams()
    console.log(chatId)
    return (
        <View>
            <Text>Page</Text>
        </View>
    );
};

const styles = StyleSheet.create({})

export default Page;
//we are able to grab the id on this page using localsearchparams()