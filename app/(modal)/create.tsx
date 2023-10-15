import {Text, StyleSheet, KeyboardAvoidingView, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRouter} from "expo-router";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import Colors from "@/colors/Colors";
import Button from "@/shared/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreatePage = () => {
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [icon, setIcon] = useState('')
    const [user, setUser] = useState<string | null>('')

    const router = useRouter();
    const startGroup = useMutation(api.groups.create)

    useEffect(() => {
        const loadUser = async () => {
            const userName = await AsyncStorage.getItem('user');
            setUser(userName);
        };
        loadUser();
    }, []);

    const onCreateGroup = async () => {
        await startGroup({
            name: name,
            description: desc,
            icon_url: icon,
            userName: user || "Anonymous",
        });
        router.back()
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.textInput} value={name} onChangeText={setName}/>

            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.textInput} value={desc} onChangeText={setDesc}/>

            <Text style={styles.label}>Icon</Text>
            <TextInput style={styles.textInput} value={icon} onChangeText={setIcon}/>
            <Button title={"Create"} onButtonPress={onCreateGroup}/>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.whiteYellowish,
        padding: 15,
    },
    label: {
        marginBottom: 3
    },
    textInput: {
        borderWidth: 1,
        borderColor: Colors.mediumGrey,
        borderRadius: 5,
        paddingHorizontal: 10,
        minHeight: 40,
        backgroundColor: Colors.white,
        marginBottom: 10
    },

})

export default CreatePage;