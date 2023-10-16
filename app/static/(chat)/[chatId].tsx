import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity, ListRenderItem, FlatList, Keyboard, Platform, ActivityIndicator
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import {useConvex, useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Doc, Id} from "@/convex/_generated/dataModel";
import Colors from "@/colors/Colors";
import {Ionicons} from "@expo/vector-icons";
import DialogTitle from "react-native-dialog/lib/Title";
import DialogDescription from "react-native-dialog/lib/Description";
import DialogButton from "react-native-dialog/lib/Button";
import DialogContainer from "react-native-dialog/lib/Container";
import * as ImagePicker from 'expo-image-picker';
import {getUserThunk} from "@/app/core/authReducer";
import {useAppDispatch, useAppSelector} from "@/app/core/store";

const Page = () => {
        const [newMessage, setNewMessage] = useState<string>('')
        const [selectedImage, setSelectedImage] = useState<string | null>(null)
        const [uploading, setUploading] = useState<boolean>(false)
        const [visible, setVisible] = useState(false)
        const [visibleError, setVisibleError] = useState(false)

        const convex = useConvex();
        const navigation = useNavigation()
        const router = useRouter();
        const {chatId} = useLocalSearchParams()
        const listRef = useRef<FlatList>(null)
        const dispatch = useAppDispatch()

        const deleteGroup = useMutation(api.groups.deleteChat)
        const deleteMessages = useMutation(api.messages.deleteMessages)
        const addMessage = useMutation(api.messages.sendMessage)
        const messages = useQuery(api.messages.get, {chatId: chatId as Id<'groups'>}) || []

        const user = useAppSelector(state => state.user.user)

        useEffect(() => {
            dispatch(getUserThunk())
        }, []);

        useEffect(() => {
            const loadGroup = async () => {
                const groupInfo = await convex.query(api.groups.getOneGroup, {id: chatId as Id<'groups'>});
                navigation.setOptions({
                    headerTitle: groupInfo!.name, headerRight: () => (
                        <View>
                            <Text style={styles.deleteChatText} onPress={() => setVisible(true)}>Delete</Text>
                        </View>
                    )
                });
            };
            loadGroup();
        }, [chatId]);

        useEffect(() => {
            setTimeout(() => {
                listRef.current?.scrollToEnd({animated: true})
            }, 300)

        }, [messages]);

        const onDeleteGroup = () => {
            const loadGroup = async () => {
                const groupInfo = await convex.query(api.groups.getOneGroup, {id: chatId as Id<'groups'>});
                if (groupInfo!.userName === user) {
                    await deleteMessages({chatId: chatId as Id<'groups'>})
                    await deleteGroup({id: chatId as Id<'groups'>})
                    setVisible(false)
                    router.back()
                } else {
                    setVisible(false)
                    setVisibleError(true)
                }
            }
            loadGroup()
        }
        const handleSendMessage = async () => {
            Keyboard.dismiss()

            if (selectedImage) {
                const url = `${process.env.EXPO_PUBLIC_CONVEX_SITE}/sendImage?user=${encodeURIComponent(user!)}&group_id=${chatId}&content=${encodeURIComponent(newMessage)}`;
                setUploading(true);

                // Convert URI to blob
                const response = await fetch(selectedImage);
                const blob = await response.blob();

                // Send blob to Convex
                fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': blob!.type},
                    body: blob,
                }).then(() => {
                    setSelectedImage(null);
                    setNewMessage('');
                })
                    .catch((err) => console.log('ERROR: ', err))
                    .finally(() => setUploading(false));
            } else {
                await addMessage({
                    group_id: chatId as Id<'groups'>,
                    content: newMessage,
                    user: user || "Anonymous"
                })
            }

            setNewMessage('')
        }

        const captureImage = async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setSelectedImage(uri);
            }
        }

        const renderMessage: ListRenderItem<Doc<'messages'>> = ({item}) => {
            const isUserMessage = item.user === user;
            return (
                <View
                    style={[styles.messageContainer, isUserMessage ? styles.userMessageContainer : styles.otherMessageContainer]}>
                    {!isUserMessage && <Text style={styles.userNickname}>
                        {item.user}
                    </Text>}
                    {item.content !== '' && <Text
                        style={[styles.messageText, isUserMessage ? styles.userMessageText : null]}>{item.content}</Text>}
                    {item.file && <Image source={{uri: item.file}} style={{width: 200, height: 200, margin: 10}}/>}
                    <Text style={isUserMessage ? styles.userTimestamp : styles.timestamp}>
                        {new Date(item._creationTime).toLocaleTimeString()}
                    </Text>
                </View>
            );
        }

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'android' ? 'height' : 'padding'}
                                      keyboardVerticalOffset={100}>

                    <FlatList ref={listRef} ListFooterComponent={<View style={{padding: 3}}/>} data={messages}
                              renderItem={renderMessage} keyExtractor={(item) => item._id.toString()}/>

                    <View style={styles.inputContainer}>
                        {selectedImage && <Image source={{uri: selectedImage}}
                                                 style={{width: 100, height: 100, margin: 10, alignSelf: 'flex-start'}}/>}
                        <View style={{flexDirection: 'row'}}>
                            <TextInput style={styles.textInput} value={newMessage} onChangeText={setNewMessage}
                                       placeholder={'Type your message'} multiline={true}/>
                            <TouchableOpacity style={styles.sendButton} onPress={captureImage}>
                                <Ionicons name="add-outline" style={styles.sendButtonText}></Ionicons>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}
                                              disabled={newMessage === ''}>
                                <Ionicons name="send-outline" style={styles.sendButtonText}></Ionicons>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <DialogContainer visible={visible}>
                        <DialogTitle>Delete group</DialogTitle>
                        <DialogDescription>Are you sure you want to delete ?</DialogDescription>
                        <DialogButton label={"Cancel"} onPress={() => setVisible(false)}/>
                        <DialogButton label={"Delete"} onPress={onDeleteGroup}/>
                    </DialogContainer>
                    <DialogContainer visible={visibleError}>
                        <DialogTitle>Error</DialogTitle>
                        <DialogDescription>You can't delete this chat</DialogDescription>
                        <DialogButton label={"Ok"} onPress={() => setVisibleError(false)}/>
                    </DialogContainer>
                </KeyboardAvoidingView>

                {uploading && (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            },
                        ]}>
                        <ActivityIndicator color={Colors.white} animating size="large"/>
                    </View>
                )}

            </SafeAreaView>
        );
    }
;

const styles = StyleSheet.create({
    deleteChatText: {
        color: Colors.white,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        backgroundColor: Colors.whiteYellowish
    },
    inputContainer: {
        padding: 10,
        backgroundColor: Colors.white,
        alignItems: 'center',
        shadowColors: Colors.black,
        shadowOffset: {
            width: 0,
            height: -8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 5,
        paddingHorizontal: 10,
        minHeight: 40,
        backgroundColor: Colors.white,
    },
    sendButton: {
        backgroundColor: Colors.yellow,
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        alignSelf: 'flex-end',
    },
    sendButtonText: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    messageContainer: {
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        maxWidth: '80%',
        padding: 10
    },
    userMessageContainer: {
        backgroundColor: Colors.yellow,
        alignSelf: 'flex-end',
        textAlign: 'center',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.white,
    },
    messageText: {
        fontSize: 16,
        flexWrap: 'wrap',
    },
    userMessageText: {
        color: Colors.white,
    },
    userNickname: {
        fontSize: 11,
        color: Colors.grey,
    },
    userTimestamp: {
        fontSize: 11,
        color: Colors.white,
        alignSelf: 'flex-end',
    },
    timestamp: {
        fontSize: 11,
        color: Colors.grey,
        alignSelf: 'flex-end',

    }

})

export default Page;
//we are able to grab the id on this page using localsearchparams()