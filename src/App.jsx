import React from 'react';
import Navbar from './components/navbar/Navbar';
import Home from './components/pages/Home';
import Feature from './components/pages/Feature';
import About from './components/pages/About';
import Help from './components/pages/Help';
import AdminDB from './components/dashboard/AdminDB'
import EmpDB from './components/dashboard/EmpDB'
import EmployeeInfo from './components/dashboard-content/EmployeeInfo'
import Empdashboard from './components/dashboard-content/Empdashboard'
import EmpProfile from './components/emp-profile/EmpProfile'
import EmpAttendance from './components/attendance/EmpAttendance'
import LoginFormik from './components/login/LoginFormik'
import ProgressScrollBar from './components/scroll/ProgressScrollBar';
import SidebarTest from './components/sidebar/SidebarTest';
import Sidebar from './components/sidebar/Sidebar';
import SidebarEmp from './components/sidebar/SidebarEmp'
import Attendance from './components/attendance/Attendance'
import LeaveRequest from './components/leaveRequest/LeaveRequest'
// import ParticlesComponent from './components/particle/particles';

import Card from './components/card/Card';
import Grid from './components/grid/Grid';
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
    {/* <ParticlesComponent id="particles" /> */}
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/feature' element={<Feature />} />
        <Route path='/about' element={<About />} />
        <Route path='/help' element={<Help />} />
        <Route path='/empDashboard' element={<Empdashboard />} />
        <Route path='/grid' element={<Grid />} />
        <Route path='/adminDashboard' element={<AdminDB />} />
        <Route path='/empInfo' element={<EmployeeInfo />} />
        <Route path='/empAttendance' element={<Attendance />} />
        <Route path='/Attendance' element={<EmpAttendance />} />
        <Route path='/empProfile' element={<EmpProfile />} />
        <Route path='/empLeave' element={<LeaveRequest />} />
        <Route path='/loginformik' element={<LoginFormik />} />
        <Route path='/sidebar' element={<Sidebar />} />
        <Route path='/sidebarEmp' element={<SidebarEmp />} />
    </Routes>
    <ProgressScrollBar />

    </>
  )
}

export default App