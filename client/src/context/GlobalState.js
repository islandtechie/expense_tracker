import React, { useReducer } from 'react';
import GlobalContext from './globalContext';
import GlobalReducer from './globalReducer';

const GlobalState = props => {
    const initialState = {
       
    }
}

const [state, dispatch] = useReducer(GlobalReducer, initialState);

return (
    <GlobalContext.Provider
        value={{
        }}
    >
        {props.children}
    </GlobalContext.Provider>
)

export default GlobalState;