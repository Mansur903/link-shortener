import React from 'react';
import { Link, useHistory } from 'react-router-dom';


import useAuth from '../hooks/index.jsx';

function Header() {
  const { logOut } = useAuth();
  const history = useHistory();

  const handleLogOut = () => {
    logOut(null);
    history.go();
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">Сервис сокращения ссылок</a>
        {localStorage.token !== undefined ? <Link to="/login"><button type="button" onClick={handleLogOut} className="btn btn-primary">Выйти</button></Link> : null}
      </div>
    </nav>
  );
}

export default Header;