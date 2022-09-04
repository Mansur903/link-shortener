import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Registration from './components/Registration.jsx';
import Authorization from './components/Authorization/Authorization.jsx';
import AuthContext from './context/index.jsx';
import Main from './components/Main.jsx';
import Header from './components/Header.jsx';

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = React.useState(null);
  const logOut = (param) => {
    localStorage.removeItem('token');
    setLoggedIn(param);
  };
  const logIn = (response) => {
    localStorage.token = response.data.access_token;
    setLoggedIn(true);
  };

  return (
    <AuthContext.Provider value={{
      logOut, logIn, loggedIn, setLoggedIn,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const isAuthentificated = () => {
    if (localStorage.token === undefined) return false;
    return true;
  };

  return (
    <Route
      render={() => (isAuthentificated() ? (
        children
      ) : (
        <Redirect to={{
          pathname: '/login',
        }}
        />
      ))}
    />
  );
}


function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Header />
          <Switch>
            <Route path='/login'>
              <Authorization />
            </Route>

            <Route path='/signup'>
              <Registration />
            </Route>

            <Route exact path='/'>
              <PrivateRoute>
                <Main />
              </PrivateRoute>
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
