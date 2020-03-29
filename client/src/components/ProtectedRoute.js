import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import globalContext from '../context/globalContext';

export const ProtectedRoute = ({
  component: Component,
  ...rest
}) => {
    const GlobalContext = useContext(globalContext);
  return (
    <Route
      {...rest}
      render={props => {
        if (GlobalContext.isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
