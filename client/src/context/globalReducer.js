export default (state, action) => {
    switch(action.type) {
        case 'SET_IS_AUTHENTICATED':
            return {
                ...state,
                isAuthenticated: action.payload    
            };
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            };
        case 'SET_ERROR_MESSAGE':
            return {
                ...state,
                error: action.payload
            };
        case 'ADD_EXPENSE':
            return { ...state, expenses: action.payload };
        case 'SET_USER_EXPENSES':
            return {
                ...state,
                expenses: action.payload
            };
        default:
           return {
               ...state
           }
    }
}