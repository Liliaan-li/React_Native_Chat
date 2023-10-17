import AsyncStorage from "@react-native-async-storage/async-storage";
import {describe} from '@jest/globals'
import {authReducer, getUserAction, getUserThunk, setUserThunk, UserType} from "../app/core/authReducer";
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
describe('authReducer', () => {
    afterEach(() => {
        AsyncStorage.clear(); // Clear AsyncStorage after each test
    });

    it("should set user in AsyncStorage and update state", async () => {
        const userName = "JohnDoe";
        const initialState: UserType = { user: null };

        // Dispatch setUserThunk to add the user to AsyncStorage and update the state
        await setUserThunk(userName)(jest.fn());

        // Get the state after adding the user
        const newState = authReducer(initialState, getUserAction(userName));

        expect(newState.user).toEqual(userName);

        // Get the user from AsyncStorage
        const storedUser = await AsyncStorage.getItem("user");

        expect(storedUser).toEqual(userName);
    });

    it("should get user from AsyncStorage and update state", async () => {
        const userName = "JohnDoe";
        const initialState: UserType = { user: null };

        // Add the user to AsyncStorage for testing
        await AsyncStorage.setItem("user", userName);

        // Dispatch getUserThunk to get the user from AsyncStorage and update the state
        await getUserThunk()(jest.fn());

        // Get the state after retrieving the user
        const newState = authReducer(initialState, getUserAction(userName));

        expect(newState.user).toEqual(userName);
    });
});


