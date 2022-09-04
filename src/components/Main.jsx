import React from 'react';
import { Table, Button } from 'react-bootstrap';
import {
  Formik, Form, Field,
} from 'formik';
import { object, string } from 'yup';
import axios from 'axios';
import _ from 'lodash';
import { ChevronDown } from 'react-bootstrap-icons';

function Main() {
  const [state, setState] = React.useState([]);


  const handleSubmit = (values, resetForm) => (e) => {
    e.preventDefault();
    const encoded = encodeURIComponent(values.link);
    axios.defaults.headers.post['Authorization'] = `Bearer ${localStorage.token}`;
    axios.post(`http://79.143.31.216/squeeze?link=${encoded}`)
      .then((response) => {
        console.log(response);
        const data = response.data;
        const oldState = state;
        const newState = [...oldState, data];
        setState(newState);
      });
    resetForm();
  }

  const userSchema = object({
    link: string().url().required('Это обязательное поле'),
  });

  const generateTableString = (state) => {
    return state.map((item) => {
      return(
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.target}</td>
          <td>http://79.143.31.216/s/{item.short}</td>
          <td>{item.counter}</td>
        </tr>
      )
    })
  }

  React.useEffect(() => {
    const statistics = setInterval(() => {
      getStatistics();
    }, 3000);
    return () => clearInterval(statistics);
  });

  const compareFn = (item) => (a, b) => {
    if (typeof a[item] !== string) {
      if (a[item] >= b[item]) {
        console.log(-1)
        return -1;
      }
      if (a[item] < b[item]) {
        console.log(1)
        return 1;
      }
      return 0;
    } else {
      return a.localeCompare(b);
    }
  }
  const makeSort = (id) => () => {
    const data = state;
    const sortedData = [...data.sort(compareFn(id))];
    setState(sortedData);
  }

  const getStatistics = () => {
    axios.defaults.headers.get['Authorization'] = `Bearer ${localStorage.token}`;
    axios.get('http://79.143.31.216/statistics?order=asc_short&offset=0&limit=0')
    .then((response) => {
      const data = response.data;
      const addedLinks = state;
      const newState = addedLinks.map((item) => _.find(data, function(o) { return o.id === item.id}));
      setState(newState);
    });
  }

  return(
    <div className="container-fluid h-100 mt-5 col-8">
      <div className="row justify-content-center align-content-center h-100">
        <Formik
          initialValues={{
            link: '',
          }}
          validateOnMount
          validationSchema={userSchema}
        >
          {({
            errors, touched, handleChange, handleBlur, values, isValid, resetForm,
          }) => (
            <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={handleSubmit(values, resetForm)}>
              <Field className="rounded w-100 p-2 mb-2" name="link" placeholder='Вставьте ссылку'></Field>
              <Button className="w-100 mb-3 btn btn-outline-primary" variant="null" type="submit" disabled={!isValid}>Получить короткую ссылку</Button>
            </Form>
          )}
        </Formik>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                ID
                <Button onClick={makeSort('id')} size='sm' className="ms-3" variant="outline-primary"><ChevronDown /></Button>
              </th>
              <th>
                Исходная ссылка
                <Button onClick={makeSort('target')} size='sm' className="ms-3" variant="outline-primary"><ChevronDown /></Button>
              </th>
              <th>
                Короткая ссылка
                <Button onClick={makeSort('short')} size='sm' className="ms-3" variant="outline-primary"><ChevronDown /></Button>
              </th>
              <th>
                Кол-во переходов по короткой ссылке
                <Button onClick={makeSort('counter')} size='sm' className="ms-3" variant="outline-primary"><ChevronDown /></Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {generateTableString(state)}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Main;