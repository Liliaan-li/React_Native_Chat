import AsyncStorage from "@react-native-async-storage/async-storage";
import {Dispatch} from "redux";

export type UserType = {
    user: string | null
}
const initialState: UserType = {
    user: ''
}
export const authReducer = (state: UserType = initialState, action: ActionsType): UserType => {
    switch (action.type) {
        case "GET-USERS":{
            return {...state, user: action.user}
        }
        default:
            return state
    }
}

//actions
export const getUserAction = (user: string | null) => (
    {
        type: 'GET-USERS',
        user

    } as const
)

//thunks
export const getUserThunk = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        AsyncStorage.getItem('user').then(user => {
            dispatch(getUserAction(user))
        });

    };
}
export const setUserThunk = (userName:string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        AsyncStorage.setItem('user', userName).then(() => {
            dispatch(getUserAction(userName))
        });

    };
}
//types
export type ActionsType = ReturnType<typeof getUserAction>