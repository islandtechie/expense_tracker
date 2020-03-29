import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
const axios = require('axios');


const Index= () => {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();
    const [redirect, setRedirect] = useState(false);

    if (redirect) return <Redirect to="/" />;
    

    const inputFirstName = (e) => {
      setFirstName(e.target.value);
    }

    const inputLastName = (e) => {
      setLastName(e.target.value);
    }

    const inputEmail = (e) => {
      setEmail(e.target.value);
    }

    const inputPassword = (e) => {
      setPassword(e.target.value)     
    }

    const inputPassword2 = (e) => {
      setPassword2(e.target.value)     
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('The First Name entered is: ', firstName);
        console.log('The Last Name entered is: ', lastName);
        console.log('The Email entered is: ', email);
        console.log('The Password entered is: ', password);
        console.log('The Password2 entered is: ', password2);

        axios.post('/api/register', {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        })
        .then(function (response) {
          if (response.status === 201) {
            setRedirect(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    return (

      
        <div className="register-page">
            <div className="app-login">
              <h3>Register</h3>
              <form onSubmit={onSubmit} className="login-form">
                <input 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  placeholder="First Name"
                  onChange={inputFirstName}
                />
                <input 
                  type="text" 
                  name="lastName" 
                  id="lastName" 
                  placeholder="Last Name"
                  onChange={inputLastName}
                />
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="Email" 
                  onChange={inputEmail}
                />
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="Password"
                  onChange={inputPassword}
                />
                <input 
                  type="password" 
                  name="password2" 
                  id="password2" 
                  placeholder="Re-enter Password"
                  onChange={inputPassword2}
                />
                <button type="submit">Register</button>
              </form>
            </div>
          </div>
    )
}

export default Index;
