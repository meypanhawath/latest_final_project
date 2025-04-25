import api from '../api';

const EmpLeave = {
  // Register new user
  getAllLeave: (token, page=0, size=20) => 
    api.get(`leaveRequests?page=${page}&size=${size}`, {
      headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
  // Get attendance by employee ID
  getEmployeeLeave: (token, url) => 
    api.get(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

      // Update leave request status
      updateLeave: (token, id, data) =>
        api.patch(`leaveRequests/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

};

export default EmpLeave