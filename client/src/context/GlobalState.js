import React, { useReducer } from 'react';
import GlobalContext from './globalContext';
import GlobalReducer from './globalReducer';
import axios from 'axios';

const GloablState = props => {
    const initialState = {
        isAuthenticated: false,
        isTransactionSuccessful: false,
        sessionID: null,
        user: {},
        error: {
            isError: false,
            message: ''
        },
        expenses: []

    }

    const [state, dispatch] = useReducer(GlobalReducer, initialState);

    const setIsAuthenticated = (authState) => {
            dispatch({
                type: 'SET_IS_AUTHENTICATED',
                payload: authState
            })
    }

    const authenticate = ( creds ) => {

        axios.post('/api/login', {
            email : creds.email,
            password : creds.password
        })
        .then(function (response) {
          if ( ! state.error.isError) { setErrorMessage({'status': false, 'message': ''})}
          setIsAuthenticated(true);
          setLoggedInuser({
            'id': response.data.user.id,  
            'firstName' : response.data.user.fname,
            'password' : response.data.user.lname,
            'email' : response.data.user.email,
            'registered_date': response.data.user.registered_date,
            'sessionID' : response.data.session_id
          });
          setUserExpenses(response.data.expenses);
          window.localStorage.setItem('session_id', response.data.session_id);
        })
        .catch(function (error) {
            //console.log("Error: ", error);
            //console.log("DATA ",error.response.data);
            //console.log("STATUS", error.response.status);
            //console.log("HEADERS", error.response.headers);

            setErrorMessage({'status': true, 'message': error.response.data.error});

        });
    }

    const setLoggedInuser = (user) => {
            dispatch({
                type: 'LOGIN',
                payload: user
            });
    }

    const setUserExpenses = (expenses) => {
        dispatch({
            type: 'SET_USER_EXPENSES',
            payload: expenses
        });
    }

    const deleteUserExpense = (id) => {

        const URL = '/api/expense/' + id;

        axios.delete(URL, {params: {user_id : state.user.id}}
            ).then((res) => {
                setUserExpenses(res.data.expenses);
            });
    }

    const editExpense = (record) => {

        const URL = '/api/expense/' + record.id;

        axios.put(URL, record
            ).then((res) => {
                setUserExpenses(res.data.expenses);
            });

    }

    const setErrorMessage = (error) => {
        dispatch({
            type: 'SET_ERROR_MESSAGE',
            payload: {
                'isError' : error.status,
                'message' : error.message,
            }
        });
    }

    const logout = () => {

        axios.post('/api/logout', {
            uid : state.user.id
        })
        .then(function (response) {
          setIsAuthenticated(false);
          setLoggedInuser({});
          window.localStorage.clear();
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }

    const addExpense = ( expense ) => {

        console.log("ADD EXPENSE: ", expense);

        axios.post('/api/expense', expense)
        .then((response) => {
          dispatch({
                type: 'ADD_EXPENSE',
                payload: [...state.expenses, 
                    {
                        'id': response.data.id,  
                        'date' : response.data.date,
                        'payee' : response.data.payee,
                        'description' : response.data.description,
                        'amount' : response.data.amount
                    }
                ]
            })
        })
        .catch((error) => {
            console.log("Error: ", error);
            console.log("DATA ",error.response.data);
            console.log("STATUS", error.response.status);
            console.log("HEADERS", error.response.headers);

            setErrorMessage({'status': true, 'message': error.response.data.error});
        });
    }


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
}

export default GloablState;