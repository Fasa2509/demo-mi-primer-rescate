import { Session } from 'next-auth';
import { IUser } from '../../interfaces';
import { AuthState } from '.'

type NameActionType =
| { type: 'Auth - Login', payload: Session }
| { type: 'Auth - Logout' }

export const authReducer = ( state: AuthState, action: NameActionType ): AuthState => {

    switch (action.type) {
        case 'Auth - Login':

            return {
                ...state,
                isLoggedIn: true,
                user: action.payload.user as IUser,
                expires: new Date( action.payload.expires ).getTime(),
            };

        case 'Auth - Logout':

            return {
                ...state,
                isLoggedIn: false,
                user: undefined,
                expires: undefined,
            }

        default:
            return state;
    }

}