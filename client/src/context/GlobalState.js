import React, { useReducer } from 'react';
import GlobalContext from './globalContext';
import GlobalReducer from './globalReducer';

const GlobalState = (props) => {
    const initState = {
        isAuthenticated: false,
        sessionID: null,
        user: {},
        error: {
            isError: false,
            message: ''
        },
        expenses: []
    }
}

const [state, dispatch] = useReducer(GlobalReducer, initState);

return (
    <GlobalContext.Provider
    value={{
        isAuthenticated: state.isAuthenticated,
        authenticate,
        error: state.error,
        logout,
        addExpense,
        expenses: state.expenses,
        user: state.user,
        editExpense,
        deleteUserExpense
    }}
    >
        {props.children}
    </GlobalContext.Provider>
)