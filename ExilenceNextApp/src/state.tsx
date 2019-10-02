import React, { createContext, useContext, useReducer } from 'react';

export const StateContext = createContext<any>(undefined);

export const StateProvider = ({ reducer, initialState, children }: any) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);

export const initialState = {
    session: { user: undefined }
};

export const reducer = (state: any, action: any) => {
    console.log('current state:', state);
    console.log('action dispatched:', action);
    switch (action.type) {
        case 'login':
            return {
                ...state,
                session: action.setUser
            };

        default:
            return state;
    }
};