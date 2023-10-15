import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useEffect,useState} from 'react';
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Colors from "@/colors/Colors";
import {Link} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DialogContainer from "react-native-dialog/lib/Container";
import DialogTitle from "react-native-dialog/lib/Title";
import DialogDescription from "react-native-dialog/lib/Description";
import DialogInput from "react-native-dialog/lib/Input";
import DialogButton from "react-native-dialog/lib/Button";

const Page = () => {
    const groups = useQuery(api.groups.get) || []
    const [name, setName] = useState('')
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const loadUser = async () => {
            const user = await AsyncStorage.getItem('user');
            if (!user) {
                setTimeout(() => {
                    setVisible(true);
                }, 100);
            } else {
                setName(user);
            }
        };
        loadUser();
    }, []);

    const setUser = async () => {
        let r = (Math.random() + 1).toString(36).substring(7);
        const userName = `${name}#${r}`;
        await AsyncStorage.setItem('user', userName);
        setName(userName);
        setVisible(false)
    }

    return (

        <View style={styles.mainContainer}>
            <ScrollView style={styles.wrapper}>
                {groups.map(el => (
                    <Link href={{pathname: '/(chat)/[chatId]', params: {chatId: el._id}}} key={el._id.toString()}
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
            <DialogContainer visible={visible}>
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