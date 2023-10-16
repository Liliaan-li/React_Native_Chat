import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from "@/colors/Colors";
import {Link} from "expo-router";
import DialogContainer from "react-native-dialog/lib/Container";
import DialogTitle from "react-native-dialog/lib/Title";
import DialogDescription from "react-native-dialog/lib/Description";
import DialogInput from "react-native-dialog/lib/Input";
import DialogButton from "react-native-dialog/lib/Button";
import {useAppDispatch, useAppSelector} from "@/app/core/store";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {getUserThunk, setUserThunk} from "@/app/core/authReducer";

const Page = () => {
    const groups = useQuery(api.groups.get) || []
    const dispatch = useAppDispatch()
    const [name, setName] = useState('')

    const user= useAppSelector(state => state.user.user)

    useEffect(() => {
        // AsyncStorage.clear()
        dispatch(getUserThunk())
    }, []);

    const setUser = async () => {
        let r = (Math.random() + 1).toString(36).substring(7);
        const userName = `${name}#${r}`;
        dispatch(setUserThunk(userName))
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.wrapper}>
                {groups.map(el => (
                    <Link href={{pathname: '/static/(chat)/[chatId]', params: {chatId: el._id}}} key={el._id.toString()}
                          asChild>
                        <TouchableOpacity style={styles.group}>
                            <Image source={{uri: el.icon_url}} style={styles.groupIcon}/>
                            <View style={{flex: 1}}>
                                <Text style={styles.groupText}>{el.name}</Text>
                                <Text style={styles.groupDescription}>{el.description}</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                ))}
            </ScrollView>
            <DialogContainer visible={user===''}>
                <DialogTitle>Username required</DialogTitle>
                <DialogDescription>Please insert a name to start chatting.</DialogDescription>
                <DialogInput onChangeText={setName}/>
                <DialogButton label={"Set name"} onPress={setUser}/>
            </DialogContainer>

        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    wrapper: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.whiteYellowish,
    },
    group: {
        flexDirection: "row",
        gap: 15,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        elevation: 3,
        shadowOffset: {
            width: 0,
            height: 0.5
        },
        shadowOpacity: 0.8,
        shadowRadius: 1.5

    },
    groupIcon: {
        width: 40,
        height: 40,
        borderRadius: 40
    },
    groupText: {},
    groupDescription: {
        color: Colors.grey,
    }

})

export default Page;