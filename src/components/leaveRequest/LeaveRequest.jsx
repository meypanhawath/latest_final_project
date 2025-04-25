import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import Icon from "../../assets/close.png";
import EmpLeave from "../../services/empLeave"

// --- SidebarItem Component ---
const SidebarItem = ({ icon, text, Approve, href = "#", onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out group ${
      Approve
        ? "bg-primary-color text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {React.createElement(icon, {
      className: `w-5 h-5 mr-3 flex-shrink-0 ${
        Approve ? "text-white" : "text-gray-400 group-hover:text-gray-500"
      }`,
    })}
    <span className="truncate">{text}</span>
    <HiOutlineChevronRight
      className={`w-4 h-4 ml-auto text-gray-400 ${
        Approve ? "text-white" : "opacity-0 group-hover:opacity-100"
      } transition-opacity`}
    />
  </a>
);

const StatusBadge = ({ status }) => {
  const normalized = status?.toUpperCase();
  let bgClass = "bg-gray-100";
  let textClass = "text-gray-800";

  if (normalized === "APPROVED") {
    bgClass = "bg-green-100";
    textClass = "text-green-800";
  } else if (normalized === "PENDING") {
    bgClass = "bg-yellow-100";
    textClass = "text-yellow-800";
  } else if (normalized === "REJECTED") {
    bgClass = "bg-red-100";
    textClass = "text-red-800";
  }

  return (
    <span
      className={`
        ${bgClass} ${textClass}
        px-3 py-1 inline-flex text-xs leading-5 font-semibold 
        rounded-full whitespace-nowrap
      `}
    >
      {status}
    </span>
  );
};

// const initialEmployees = [
//   {
//     id: "I-0001",
//     name: "Jane Cooper",
//     StartDate: "7-April-2015",
//     StartEnd: "7-April-2015",
//     status: "Approve",
//     reason: "Medical leave"
//   },
//   {
//     id: "I-0002",
//     name: "Doe Laly",
//     StartDate: "8-April-2015",
//     StartEnd: "8-April-2015",
//     status: "Deny",
//     reason: "Family emergency"
//   },
//   {
//     id: "I-0003",
//     name: "John reach",
//     StartDate: "8-April-2015",
//     StartEnd: "9-April-2015",
//     status: "Deny",
//     reason: "Personal reasons"
//   },
//   {
//     id: "I-0005",
//     name: "Koko Tesla",
//     StartDate: "8-April-2015",
//     StartEnd: "9-April-2015",
//     status: "Pending",
//     reason: "Vacation"
//   },
//   {
//     id: "I-0006",
//     name: "Jack bot",
//     StartDate: "8-April-2015",
//     StartEnd: "20-April-2015",
//     status: "Pending",
//     reason: "Work from home"
//   },
//   {
//     id: "I-0007",
//     name: "Mic Roza",
//     StartDate: "8-April-2015",
//     StartEnd: "21-April-2015",
//     status: "Pending",
//     reason: "Conference attendance"
//   },
// ];

const PendingCard = ({ selectedRequest, closeModal, onStatusChange }) => {
  return (
    <section className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-gray-800 font-semibold text-lg">Request for Leave</h2>
          <button onClick={closeModal} aria-label="Close modal">
            <img src={Icon} alt="close" className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex justify-between mb-4">
          <p>ID : {selectedRequest.id}</p>
          <div className="flex gap-2">
            <button
              type="button" 
              className="px-4 py-2 bg-green-100 text-green-700 border border-green-700 rounded-md hover:bg-green-200 transition-colors md:mr-1 cursor-pointer"
              onClick={() => onStatusChange("APPROVED")}
            >
              Approve
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-100 text-red-700 border border-red-700 rounded-md hover:bg-red-200 transition-colors md:mr-10 cursor-pointer"
              onClick={() => onStatusChange("REJECTED")}
            >
              Reject
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700 w-24">Name</label>
            <input
              value={selectedRequest.employee.firstName + " " + selectedRequest.employee.lastName}
              className="w-full md:w-[71%] rounded-md border border-gray-200 px-3 py-1.5 bg-gray-50"
              readOnly
            />
          </div>

          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700 w-24">Start Date</label>
            <input
              value={selectedRequest.startDate}
              className="w-full md:w-[71%] rounded-md border border-gray-200 px-3 py-1.5 bg-gray-50"
              readOnly
            />
          </div>

          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700 w-24">End Date</label>
            <input
              value={selectedRequest.endDate}
              className="w-full md:w-[71%] rounded-md border border-gray-200 px-3 py-1.5 bg-gray-50"
              readOnly
            />
          </div>

          <div className="flex items-start">
            <label className="text-sm font-medium text-gray-700 w-24">Reason</label>
            <textarea
              value={selectedRequest.reason}
              className="w-full md:w-[71%] rounded-md border border-gray-200 px-3 py-1.5 bg-gray-50"
              readOnly
              rows="3"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

function LeaveRequest() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPendingCard, setShowPendingCard] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [selectedRequest, setSelectedRequest] = useState(null);
  // const [employees] = useState([]);
  const navigate = useNavigate();

  // const handleStatusUpdate = (id, newStatus) => {
  //   setEmployees(prevEmployees =>
  //     prevEmployees.map(emp =>
  //       emp.id === id ? { ...emp, status: newStatus } : emp
  //     )
  //   );
  //   setShowPendingCard(false);
  // };



// Open the modal for a pending request
const openPendingCard = (request) => {
  if (request.status?.toLowerCase() === "pending") {
    setSelectedRequest(request);
    setShowPendingCard(true);
  }
};

// Close modal (and clear selection)
const closeModal = () => {
  setShowPendingCard(false);
  setSelectedRequest(null);
};

// Approve/Deny: persist to server then update UI
const handleStatusChange = (newStatus) => {
  const token = localStorage.getItem("accessToken");

  console.log("access Token: ", token);

  EmpLeave
    .updateLeave(token, selectedRequest.id, { status: newStatus })
    .then(() => {
      // update local list
      setLeave(prev =>
        prev.map(r =>
          r.id === selectedRequest.id
            ? { ...r, status: newStatus }
            : r
        )
      );
      closeModal(); // clean close
    })
    .catch(err => {
      console.error("Failed to update status:", err);
      // TODO: show toast/alert
    });
};

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setShowLogoutModal(false);
    navigate("/");

  };

  const [leaveRequests, setLeave] = useState([]);

  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    EmpLeave.getAllLeave(accessToken, 0, 100)
      .then((response) => {
        console.log("Getting all Leave: ", response.data);
  
        const leavePromises = response.data._embedded.leaveRequests.map((att) =>
          EmpLeave.getEmployeeLeave(
            accessToken,
            att._links.employee.href
          ).then((res) => {
            att.employee = res.data; // Add employee data to the attendance object
            const href = att._links.self.href;
            att.id = href.substring(href.lastIndexOf("/") + 1);
            return att; // Return the enriched attendance object
          })
        );
  
        // Wait for all API calls to complete
        Promise.all(leavePromises)
          .then((enrichedAttendances) => {
            console.log("Final enriched attendances: ", enrichedAttendances);
            setLeave(enrichedAttendances); // Update state with all enriched attendances
          })
          .catch((error) => {
            console.error("Error enriching attendances: ", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching attendance: ", error);
      });
  }, []);

  const filteredEmployees = leaveRequests.filter((emp) => {
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

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Pending Card Modal */}
      {showPendingCard && selectedRequest && (
  <PendingCard
    selectedRequest={selectedRequest}
    closeModal={closeModal}
    onStatusChange={handleStatusChange}
  />
)}

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-30 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 lg:shadow-md lg:z-auto`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 md:h-20 border-b flex-shrink-0 px-18">
          <div className="flex items-center">
            <span className="text-lg md:text-xl font-semibold text-gray-800">
              Checkify
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
            aria-label="Close sidebar"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-2 md:px-4 py-4 space-y-2 overflow-y-auto">
          <Link to="/adminDashboard">
            <SidebarItem
              icon={HiOutlineViewGrid}
              text="Dashboard"
              onClick={closeSidebar}
            />
          </Link>
          <Link to="/empInfo">
            <SidebarItem
              icon={HiOutlineUsers}
              text="Employee"
              onClick={closeSidebar}
            />
          </Link>
          <Link to="/empAttendance">
            <SidebarItem
              icon={HiOutlineCalendar}
              text="Attendance"
              onClick={closeSidebar}
            />
          </Link>
          <SidebarItem
            icon={HiOutlineDocumentText}
            text="Leave request"
            Approve={true}
            onClick={closeSidebar}
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="px-2 md:px-4 py-4 border-t flex-shrink-0">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 group"
          >
            <HiOutlineLogout className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500 flex-shrink-0" />
            <span className="truncate">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
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
              />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-xl font-bold text-primary-color truncate">
            Leave Request
          </h1>
          <button className="p-1 ml-auto bg-blue-100 rounded-full text-primary-color hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <HiOutlineBell className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            {/* Table Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 space-y-3 sm:space-y-0 sm:space-x-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                All Employee Leave Requests
              </h2>
              <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
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
                
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full block md:table divide-y divide-gray-200">
                <thead className="block md:table-header-group bg-gray-50">
                  <tr className="border-b border-gray-200 block md:table-row">
                    <th className="w-60 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider block md:table-cell">
                      Name
                    </th>
                    <th className="w-60 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider block md:table-cell">
                      Start Date
                    </th>
                    <th className="w-60 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap block md:table-cell">
                      End Date
                    </th>
                    <th className="w-60 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider block md:table-cell">
                      Status
                    </th>
                    <th className="w-2 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider block md:table-cell">Reason</th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group">
  {currentEmployees.map((emp, id) => (
    <tr
      key={id}
      onClick={() => openPendingCard(emp)}
      className="cursor-pointer hover:bg-gray-100 transition-colors block md:table-row"
    >
      <td className="px-4 py-3 block md:table-cell">
        {emp.employee?.firstName} {emp.employee?.lastName}
      </td>
      <td className="px-4 py-3 block md:table-cell">{emp.startDate}</td>
      <td className="px-4 py-3 block md:table-cell">{emp.endDate}</td>
      <td className="px-4 py-3 block md:table-cell">
        <StatusBadge status={emp.status} />
      </td>
      <td className="px-4 py-3 block md:table-cell truncate">{emp.reason}</td>
    </tr>
  ))}
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

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveRequest;