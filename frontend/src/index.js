import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'
import store from './store'
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';


import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';

import Homepage from './screens/Homepage';
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import HealthDataForm from "./screens/HealthDataForm";
import Register from "./screens/Register";
import UserRoute from './components/UserRoute';
import MyAppointments from './screens/MyAppointments';
import Profile from './screens/Profile';
import Appointments from './screens/Doctor/Appointments';
import Patients from './screens/Doctor/Patients';
import Prescriptions from './screens/Doctor/Prescriptions';
import Doctors from './screens/Doctor/Doctors';
import ScheduleAppointment from './screens/Appointments/ScheduleAppointment';
import Chat from './screens/Chat';

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Homepage/>}/>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />

      <Route path='/' element={<UserRoute />}>
        <Route path='/health' element={<HealthDataForm />} />
        <Route path='/myappointments' element={<MyAppointments />} />
        <Route path='/profile' element={<Profile />} />
         <Route path='/appointments' element={<Appointments />} />
        <Route path='/patients' element={<Patients />} />
        <Route path='/prescriptions' element={<Prescriptions />} />
       <Route path='/doctor' element={<Doctors />} />
       <Route path='/schedule_appointment' element={<ScheduleAppointment />} />
        <Route path='/chat/:appointId/:id' element={<Chat />} />
        </Route>

    </Route>
  )
)


const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </React.StrictMode>
);



reportWebVitals()

