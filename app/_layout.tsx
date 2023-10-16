import {Link, Stack} from 'expo-router';
import {ConvexProvider, ConvexReactClient} from "convex/react";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Colors from "@/colors/Colors";
import React from "react";
import {Provider} from "react-redux";
import {store} from "@/app/core/store";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
})
export default function RootLayoutNav() {
    return (
        <ConvexProvider client={convex}>
            <Provider store={store}>
                <Stack>
                    <Stack.Screen name={"index"} options={{
                        headerTitle: "My chats",
                        headerStyle: {
                            backgroundColor: Colors.yellow,
                        },
                        headerTintColor: Colors.white,
                        headerRight: () => (
                            <Link href={"/static/(modal)/create"} asChild>
                                <TouchableOpacity>
                                    <Ionicons name={"add"} size={32} color={Colors.white}/>
                                </TouchableOpacity>
                            </Link>
                        )
                    }}/>
                    <Stack.Screen name={"static/(modal)/create"} options={{
                        headerTitle: "Start a chat",
                        headerStyle: {
                            backgroundColor: Colors.yellow,
                        },
                        headerTintColor: Colors.white,
                        presentation: "modal",
                    }}/>
                    <Stack.Screen name={"static/(chat)/[chatId]"} options={{
                        headerStyle: {
                            backgroundColor: Colors.yellow,
                        },
                        headerTintColor: Colors.white,
                        headerTitle: "",
                    }}/>
                </Stack>
            </Provider>
        </ConvexProvider>
    )
}

