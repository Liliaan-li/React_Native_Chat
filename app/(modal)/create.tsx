import {Text, StyleSheet, KeyboardAvoidingView, TextInput} from 'react-native';
import React, {useState} from 'react';
import {useRouter} from "expo-router";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import Colors from "@/colors/Colors";

const CreatePage = () => {
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [icon, setIcon] = useState('')

    const router = useRouter();
    const startGroup = useMutation(api.groups.create)

    const onCreateGroup = async ()=>{
        await startGroup({
            name:name,
            description: desc,
            icon_url: icon
        })
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text>Name</Text>

            <TextInput />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.whiteYellowish,
        padding:10,
    }
})

export default CreatePage;