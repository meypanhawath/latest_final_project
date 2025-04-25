import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineLogout,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiX,
} from "react-icons/hi";

import EmpService from "../../services/empService";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import BlinkBlur from "../animation/BlinkBlur";

// --- Reusable Components ---
const SidebarItem = ({ icon, text, active, href = "#", onClick, arrowIcon }) => {
  const ArrowIcon = arrowIcon || HiOutlineChevronDown;
  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out group ${
        active
          ? "bg-primary-color text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {React.createElement(icon, {
        className: `w-5 h-5 mr-3 flex-shrink-0 ${
          active ? "text-white" : "text-gray-400 group-hover:text-gray-500"
        }`,
      })}
      <span className="truncate">{text}</span>
      <ArrowIcon
        className={`w-4 h-4 ml-auto text-gray-400 ${
          active ? "text-white" : "opacity-0 group-hover:opacity-100"
        } transition-opacity`}
      />
    </a>
  );
};

const StatusBadge = ({ status }) => {
  const normalized = status?.toUpperCase();
  let bgClass = "bg-gray-100";
  let textClass = "text-gray-800";

  if (normalized === "ACTIVE") {
    bgClass = "bg-green-100";
    textClass = "text-green-800";
  } else if (normalized === "INACTIVE") {
    bgClass = "bg-yellow-100";
    textClass = "text-yellow-800";
  } else if (normalized === "RESIGNED") {
    bgClass = "bg-red-100";
    textClass = "text-red-800";
  }

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${bgClass} ${textClass}`}
    >
      {status}
    </span>
  );
};

function EmployeeInfo() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const navigate = useNavigate();

  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    EmpService.getAllEmployee(accessToken, currentPage - 1, itemsPerPage)
      .then((response) => {
        console.log("API Response:", response.data);
        const employeePromises = response.data._embedded.employees.map((emp) =>
          EmpService.getEmployeeInfo(accessToken, emp._links.department.href).then((res) => {
            emp.department = res.data; // Add department data to the employee object
            return emp; // Return the enriched employee object
          })
        );
  
        Promise.all(employeePromises)
          .then((enrichedEmployees) => {
            console.log("Enriched Employees:", enrichedEmployees);
            setEmployees(enrichedEmployees); // Update state with all enriched employees
          })
          .catch((error) => {
            console.error("Error enriching Employees:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, [currentPage]);

  const validationSchema = Yup.object({
    
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().matches(/^\d+$/, "Phone number must be numeric").required("Phone number is required"),
    dateOfJoining: Yup.string().required("Date of Joining is required"),
    status: Yup.string().required("Status is required"),
    department: Yup.string().required("Department is required"),
  });

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const deptName = (emp.department?.name || "").toLowerCase();
    return fullName.includes(term) || deptName.includes(term);
  });
  
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1); // Reset to the first page when searching
    }
  }, [searchTerm]);

  const handleDeleteEmployee = (id) => {
    console.log("Deleting employee with ID:", id); // Check if ID is passed correctly
    
    if (!id) {
      console.error("Employee ID is undefined!");
      alert("Invalid employee ID. Please try again.");
      return;
    }
  
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      alert("Access token is missing. Please log in.");
      return;
    }
  
    console.log("Access Token:", accessToken); // Check if the token is correct
    
    if (window.confirm("Are you sure you want to delete this employee?")) {
      EmpService.deleteEmployee(accessToken, id)  // Call the service method
        .then(() => {
          alert("Employee deleted successfully.");
          setEmployees((prevEmployees) =>
            prevEmployees.filter((employee) => employee.id !== id)
          );
        })
        .catch((error) => {
          console.error("Error deleting employee:", error.response?.data || error.message);
          alert("Failed to delete employee. Please try again.");
        });
    }
  };
  

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-30 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 lg:shadow-md lg:z-auto`}
      >
        <div className="flex items-center justify-between h-16 md:h-20 border-b flex-shrink-0 px-18">
          <div className="flex items-center">
            <span className="text-lg md:text-xl font-semibold text-gray-800">Checkify</span>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
            aria-label="Close sidebar"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-2 md:px-4 py-4 space-y-2 overflow-y-auto">
          <Link to="/adminDashboard">
            <SidebarItem icon={HiOutlineViewGrid} text="Dashboard" onClick={closeSidebar} />
          </Link>

          <SidebarItem
            icon={HiOutlineUsers}
            text="Employee"
            active={true}
            onClick={closeSidebar}
            arrowIcon={HiOutlineChevronRight}
          />

          <Link to="/empAttendance">
            <SidebarItem icon={HiOutlineCalendar} text="Attendance" onClick={closeSidebar} />
          </Link>

          <Link to="/empLeave">
            <SidebarItem icon={HiOutlineDocumentText} text="Leave request" onClick={closeSidebar} />
          </Link>
        </nav>

        <div className="px-2 md:px-4 py-4 border-t flex-shrink-0">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 group focus:outline-none"
          >
            <HiOutlineLogout className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500 flex-shrink-0" />
            <span className="truncate">Log out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 md:p-6 bg-white">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 mr-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Open sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-xl font-bold text-primary-color truncate">
            Employee
          </h1>
          <button className="p-1 ml-auto bg-blue-100 rounded-full text-primary-color hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <HiOutlineBell className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 space-y-3 sm:space-y-0 sm:space-x-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">All Employee</h2>
              <div className="flex flex-row sm:flex-row items-center w-full sm:w-auto  sm:space-y-0 sm:space-x-4 gap-3">
                <div className="relative w-full sm:w-auto">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <HiOutlineSearch className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="name or department"
                    className="w-full sm:w-48 md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-color/90 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Employee</h3>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <HiX className="w-6 h-6" />
                    </button>
                  </div>

                  <Formik
                    initialValues={{
                      
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      dateOfJoining: "",
                      status: "",
                      department: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      const accessToken = localStorage.getItem("accessToken");
                      if (!accessToken) {
                        alert("Access token is missing. Please log in.");
                        setSubmitting(false);
                        return;
                      }

                      axios.post("https://eam-api.istad.co/employees",
                          {
                            
                            firstName: values.firstName,
                            lastName: values.lastName,
                            email: values.email,
                            phone: values.phone,
                            dateOfJoining: values.dateOfJoining,
                            status: values.status,
                            department: `/departments/${values.department}`,
                          },
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${accessToken}`,
                            },
                          }
                        )
                        .then((response) => {
                          const newEmp = response.data;
                          // fetch the full department object
                          return EmpService
                            .getEmployeeInfo(accessToken, newEmp._links.department.href)
                            .then((depRes) => {
                              newEmp.department = depRes.data;
                              return newEmp;
                            });
                        })
                        .then((enrichedEmp) => {
                          setEmployees((prev) => [...prev, enrichedEmp]);
                          setShowAddModal(false);
                          resetForm();
                        })
                        .catch((error) => {
                          console.error(
                            "Error adding employee:",
                            error.response?.data || error.message
                          );
                          alert("Failed to add employee. Please check the input data.");
                        })
                        .finally(() => {
                          setSubmitting(false);
                        });
                    }}
                  >
                    {({ isSubmitting, errors, touched }) => (
                      <Form>
                        <div className="space-y-4">
                        {/* <div>
   <label className="block text-sm font-medium text-gray-700">
     Employee ID
   </label>
   <Field
     name="id"
     type="number"
     placeholder="Enter Employee ID"
     className={`w-full px-3 py-2 border ${
       errors.id && touched.id ? "border-red-500" : "border-gray-300"
     } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
   />
   {errors.id && touched.id && (
     <p className="text-red-500 text-sm">{errors.id}</p>
   )}
 </div> */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                            <Field
                              
                              name="firstName"
                              type="text"
                              placeholder="Enter First Name"
                              className={`w-full px-3 py-2 border ${
                                errors.firstName && touched.firstName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.firstName && touched.firstName && (
                              <p className="text-red-500 text-sm">{errors.firstName}</p>
                            )}
                          </div>
                         
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                            <Field
                              name="lastName"
                              type="text"
                              placeholder="Enter Last Name"
                              className={`w-full px-3 py-2 border ${
                                errors.lastName && touched.lastName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.lastName && touched.lastName && (
                              <p className="text-red-500 text-sm">{errors.lastName}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <Field
                              name="email"
                              type="email"
                              placeholder="Enter Email"
                              className={`w-full px-3 py-2 border ${
                                errors.email && touched.email
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.email && touched.email && (
                              <p className="text-red-500 text-sm">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Phone Number
                            </label>
                            <Field
                              name="phone"
                              type="text"
                              placeholder="Enter Phone Number"
                              className={`w-full px-3 py-2 border ${
                                errors.phone && touched.phone
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.phone && touched.phone && (
                              <p className="text-red-500 text-sm">{errors.phone}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Date of Joining
                            </label>
                            <Field
                              name="dateOfJoining"
                              type="date"
                              placeholder="Enter Date Of joining"
                              className={`w-full px-3 py-2 border ${
                                errors.dateOfJoining && touched.dateOfJoining
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.dateOfJoining && touched.dateOfJoining && (
                              <p className="text-red-500 text-sm">{errors.dateOfJoining}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <Field
                                name="status"
                                as="select"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Status</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="RESIGNED">RESIGNED</option>
                              </Field>
                            {errors.status && touched.status && (
                              <p className="text-red-500 text-sm">{errors.status}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Department
                            </label>
                            <Field
                                name="department"
                                as="select"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Department</option>
                                <option value="1">HR</option>
                                <option value="2">IT</option>
                                <option value="3">Finance</option>
                              </Field>
                            {errors.department && touched.department && (
                              <p className="text-red-500 text-sm">{errors.department}</p>
                            )}
                          </div>

   
                          {/* Add other fields here */}
                          </div>
                        <div className="flex justify-end mt-6">
                          <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            {isSubmitting ? <BlinkBlur color="#0800cb" size="medium" text="" textColor="" /> : "Add"}
                          </button>
                        </div>
                        
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            )}

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full block md:table divide-y divide-gray-200">
                <thead className="block md:table-header-group bg-gray-50">
                  <tr className="border-b border-gray-200 block md:table-row">
                    <th className="w-60 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider block md:table-cell">
                      Name
                    </th>
                    <th className="w-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider items-center block md:table-cell">
                      Department
                      <HiOutlineChevronDown className="w-4 h-4 ml-1 inline-block md:hidden" />
                    </th>
                    <th className="w-90 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider block md:table-cell">
                      Email
                    </th>
                    <th className="w-60 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap block md:table-cell">
                      Date of Joining
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider block md:table-cell">
                      Status
                    </th>
                  </tr>
                  </thead>
                  <tbody className="block md:table-row-group">
  {currentEmployees.length === 0 ? (
    <tr className="block md:table-row">
      <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
        No employees found
      </td>
    </tr>
  ) : (
    currentEmployees.map((employee) => (
      <tr key={employee.id} className="border-b border-gray-200 block md:table-row hover:bg-gray-50">
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 block md:table-cell">
          {employee.firstName + " " + employee.lastName}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 block md:table-cell">
          {employee.department.name}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs block md:table-cell">
          {employee.email}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 block md:table-cell">
          {employee.dateOfJoining}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm block md:table-cell">
          <StatusBadge status={employee.status} />
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm block md:table-cell">
        <button
  onClick={() => {
    console.log("Deleting employee with ID:", employee.id);
    handleDeleteEmployee(employee.id);
  }}
  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
>
  Delete
</button>
        </td>
      </tr>
    ))
  )}
</tbody>
              </table>
            </div>
            

            

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 md:mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-3 md:mb-0">
                Showing {indexOfFirstEmployee + 1} to{" "}
                {Math.min(indexOfLastEmployee, filteredEmployees.length)} of{" "}
                {filteredEmployees.length} entries
              </p>
              <nav className="flex items-center space-x-1 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((number) => (
  <button
    key={number}
    onClick={() => setCurrentPage(number)}
    className={`px-2.5 py-1 border rounded-md text-sm ${
      currentPage === number
        ? "border-blue-600 bg-blue-600 text-white"
        : "border-gray-300 text-gray-700 hover:bg-gray-100"
    }`}
  >
    {number}
  </button>
))}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeInfo;