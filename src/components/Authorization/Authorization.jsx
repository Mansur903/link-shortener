import React from 'react';
import {
  Formik, Form,
} from 'formik';
import { object, string } from 'yup';
import {
  Button,
} from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';

import useAuth from '../../hooks/index.jsx';
import TextField from '../TextField/TextField.jsx';
import './style.css';

function Authorization() {
  const history = useHistory();
  const { logIn, logOut, loggedIn } = useAuth();
  const goHome = () => {
    history.push('/');
    history.go();
  };
  const errorClassNames = cn({
    'error-field': !loggedIn,
    'no-error-field': loggedIn === null || loggedIn,
  });

  const userSchema = object({
    username: string().min(3, 'Должно быть 3 или более символов').required('Это обязательное поле'),
    password: string().min(4, 'Должно быть 4 или более символов').required('Это обязательное поле'),
  });

  const handleSubmit = (values) => (e) => {
    e.preventDefault();
    axios.post('http://79.143.31.216/login', `username=${values.username}&password=${values.password}`)
      .then((response) => {
        console.log('response :', response);
        logIn(response);
        goHome();
      })
      .catch((error) => {
        console.log(error);
        logOut(false);
      })
  };

  return(
    <div className="container-fluid h-100 mt-5">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                }}
                validateOnMount
                validationSchema={userSchema}
              >
                {({
                  errors, touched, handleChange, handleBlur, values, isValid,
                }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={handleSubmit(values)}>
                    <h1 className="text-center mb-4">Войти</h1>
                    <TextField name="username" placeholder='Ваш ник' errors={errors} handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
                    <TextField name="password" placeholder='Пароль' errors={errors} handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
                    <Button className="w-100 mb-3 btn btn-outline-primary" variant="null" type="submit" disabled={!isValid}>Войти</Button>
                    <div className={errorClassNames}>Неправильный логин или пароль</div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>
                  Нет аккаунта?
                  {' '}
                </span>
                <a href="/signup">Регистрация</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Authorization;