/**
 * Appointments JavaScript for Patient Medicine & Appointment Tracking System
 * Handles appointment booking, viewing, and management
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in, redirect to login if not
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  // DOM Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const upcomingTableBody = document.querySelector('#upcomingAppointmentsTable tbody');
  const pastTableBody = document.querySelector('#pastAppointmentsTable tbody');
  const noUpcomingAppointments = document.getElementById('noUpcomingAppointments');
  const noPastAppointments = document.getElementById('noPastAppointments');
  const bookNowBtn = document.getElementById('bookNowBtn');
  const doctorSelect = document.getElementById('doctor');
  const timeSelect = document.getElementById('time');
  const appointmentForm = document.getElementById('appointmentForm');
  const alertContainer = document.getElementById('alertContainer');

  const doctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiologist", image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg" },
    { id: 2, name: "Dr. James Wilson", specialization: "Dermatologist", image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg" },
    { id: 3, name: "Dr. Emily Chen", specialization: "Pediatrician", image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg" },
    { id: 4, name: "Dr. Michael Brown", specialization: "Neurologist", image: "https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg" },
    { id: 5, name: "Dr. Patricia Lee", specialization: "Orthopedic Surgeon", image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg" }
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM"
  ];

  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

  // Tab switching functionality
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Book Now button functionality
  if (bookNowBtn) {
    bookNowBtn.addEventListener('click', function() {
      // Switch to book tab
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      const bookBtn = document.querySelector('[data-tab="book"]');
      bookBtn.classList.add('active');
      document.getElementById('book').classList.add('active');
    });
  }

  function populateDoctors() {
    doctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor.id;
      option.textContent = `${doctor.name} - ${doctor.specialization}`;
      doctorSelect.appendChild(option);
    });
  }

  function populateTimeSlots() {
    timeSlots.forEach(slot => {
      const option = document.createElement('option');
      option.value = slot;
      option.textContent = slot;
      timeSelect.appendChild(option);
    });
  }

  function loadAppointments() {
    if (upcomingTableBody) upcomingTableBody.innerHTML = '';
    if (pastTableBody) pastTableBody.innerHTML = '';
    
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let upcomingCount = 0;
    let pastCount = 0;

    const userAppointments = appointments.filter(appointment => 
      appointment.userId === currentUser.id
    );
    
    userAppointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      
      const doctor = doctors.find(doc => doc.id === parseInt(appointment.doctorId));

      const row = document.createElement('tr');

      const formattedDate = new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(new Date(appointment.date));
      
      if (appointmentDate >= today && appointment.status !== 'cancelled') {
        upcomingCount++;
        
        row.innerHTML = `
          <td>${doctor.name}</td>
          <td>${doctor.specialization}</td>
          <td>${formattedDate}</td>
          <td>${appointment.time}</td>
          <td><span class="status-badge status-${appointment.status}">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-action btn-reschedule" data-id="${appointment.id}">Reschedule</button>
              <button class="btn btn-action btn-cancel" data-id="${appointment.id}">Cancel</button>
            </div>
          </td>
        `;
        
        upcomingTableBody.appendChild(row);
      } else {
        pastCount++;
        
        row.innerHTML = `
          <td>${doctor.name}</td>
          <td>${doctor.specialization}</td>
          <td>${formattedDate}</td>
          <td>${appointment.time}</td>
          <td><span class="status-badge status-${appointment.status}">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span></td>
        `;
        
        pastTableBody.appendChild(row);
      }
    });

    if (noUpcomingAppointments) {
      noUpcomingAppointments.style.display = upcomingCount === 0 ? 'block' : 'none';
    }
    
    if (noPastAppointments) {
      noPastAppointments.style.display = pastCount === 0 ? 'block' : 'none';
    }
    
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    cancelButtons.forEach(button => {
      button.addEventListener('click', function() {
        const appointmentId = parseInt(this.getAttribute('data-id'));
        cancelAppointment(appointmentId);
      });
    });
    
    const rescheduleButtons = document.querySelectorAll('.btn-reschedule');
    rescheduleButtons.forEach(button => {
      button.addEventListener('click', function() {
        const appointmentId = parseInt(this.getAttribute('data-id'));
        showRescheduleForm(appointmentId);
      });
    });
  }

  function cancelAppointment(appointmentId) {
    const appointmentIndex = appointments.findIndex(app => app.id === appointmentId);
    
    if (appointmentIndex !== -1) {
      appointments[appointmentIndex].status = 'cancelled';
      
      localStorage.setItem('appointments', JSON.stringify(appointments));

      showAlert('Appointment cancelled successfully', 'success', alertContainer);

      loadAppointments();
    }
  }

  function showRescheduleForm(appointmentId) {

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    const bookBtn = document.querySelector('[data-tab="book"]');
    bookBtn.classList.add('active');
    document.getElementById('book').classList.add('active');

    showAlert('Please select a new date and time for your appointment', 'warning', alertContainer);

    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      doctorSelect.value = appointment.doctorId;

      cancelAppointment(appointmentId);
    }
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const doctorId = doctorSelect.value;
      const date = document.getElementById('date').value;
      const time = timeSelect.value;
      const reason = document.getElementById('reason').value;

      if (!doctorId) {
        showAlert('Please select a doctor', 'error', alertContainer);
        return;
      }
      
      if (!date) {
        showAlert('Please select a date', 'error', alertContainer);
        return;
      }
      
      if (!time) {
        showAlert('Please select a time slot', 'error', alertContainer);
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem('user'));

      const newAppointment = {
        id: Date.now(),
        userId: currentUser.id,
        doctorId: doctorId,
        date: date,
        time: time,
        reason: reason,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      appointments.push(newAppointment);
      
      // Save to localStorage
      localStorage.setItem('appointments', JSON.stringify(appointments));
      
      // Show success message
      showAlert('Appointment booked successfully', 'success', alertContainer);

      appointmentForm.reset();

      loadAppointments();

      setTimeout(() => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        const upcomingBtn = document.querySelector('[data-tab="upcoming"]');
        upcomingBtn.classList.add('active');
        document.getElementById('upcoming').classList.add('active');
      }, 1500);
    });
  }

  const dateInput = document.getElementById('date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formattedDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', formattedDate);
  }

  populateDoctors();
  populateTimeSlots();
  loadAppointments();
});