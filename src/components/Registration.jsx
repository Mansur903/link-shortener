import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { object, string } from 'yup';
import axios from 'axios';
import { useHistory, useNavigate } from 'react-router-dom';

import TextField from './TextField/TextField.jsx';
import useAuth from '../hooks/index.jsx';

function Registration() {
  const [registered, setStatus] = useState(null);
  const { logIn } = useAuth();
  const history = useHistory();
  const goHome = () => {
    history.push('/');
    history.go();
  };

  const userSchema = object({
    username: string().min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов').required('Это обязательное поле'),
    password: string().min(6, 'Не менее 6 символов').required('Это обязательное поле'),
    confirmPassword: string().oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
  });

  const handleSubmit = (values) => (e) => {
    e.preventDefault();
    console.log('values :', values);
    axios.post(`http://79.143.31.216/register?username=${values.username}&password=${values.password}`)
      .then((response) => {
        logIn(response);
        goHome();
      })
      .catch((error) => {
        console.log(error);
      })
  };

  return (
    <div className="container-fluid h-100 mt-5">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={userSchema}
              >
                {({
                  errors, touched, handleChange, handleBlur, values,
                }) => (
                  <Form className="w-50" onSubmit={handleSubmit(values)}>
                    <h1 className="text-center mb-4">Регистрация</h1>
                    <TextField name="username" errors={errors} placeholder="Имя пользователя" handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
                    <TextField name="password" errors={errors} placeholder="Пароль" handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
                    <TextField name="confirmPassword" errors={errors} placeholder='Подтвердите пароль' handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
                    <Button type="submit" className="w-100 btn btn-outline-primary" variant="null">Зарегистрироваться</Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>
                  Уже есть аккаунт?
                  {' '}
                </span>
                <a href="/login">Авторизация</a>
              </div>
            </div>
          </div>
          <div className="error-field row justify-content-center align-content-center m-10">{registered === null ? null : 'Пользователь с таким именем уже зарегистрирован'}</div>
        </div>
      </div>
    </div>
  );
};

export default Registration;