/**
 * Prescriptions JavaScript for Patient Medicine & Appointment Tracking System
 * Handles prescriptions display and management
 */

document.addEventListener('DOMContentLoaded', function() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  const prescriptionsContainer = document.getElementById('prescriptionsContainer');
  const noPrescriptions = document.getElementById('noPrescriptions');
  const searchInput = document.getElementById('searchPrescription');
  const filterStatus = document.getElementById('filterStatus');
  const modal = document.getElementById('prescriptionModal');
  const prescriptionDetails = document.getElementById('prescriptionDetails');
  const closeModal = document.querySelector('.close-modal');
  const alertContainer = document.getElementById('alertContainer');

  const doctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiologist" },
    { id: 2, name: "Dr. James Wilson", specialization: "Dermatologist" },
    { id: 3, name: "Dr. Emily Chen", specialization: "Pediatrician" },
    { id: 4, name: "Dr. Michael Brown", specialization: "Neurologist" },
    { id: 5, name: "Dr. Patricia Lee", specialization: "Orthopedic Surgeon" }
  ];

  // Sample prescriptions (would normally come from an API/database)
  let prescriptions = JSON.parse(localStorage.getItem('prescriptions'));
  
  // If no prescriptions in localStorage, use demo data
  if (!prescriptions) {
    // Generate demo prescriptions
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userId = currentUser ? currentUser.id : 1;
    
    prescriptions = [
      {
        id: 1,
        userId: userId,
        doctorId: 1,
        prescriptionNumber: "RX-2025-001",
        issueDate: "2025-01-15",
        expiryDate: "2025-07-15",
        status: "active",
        medicines: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            instructions: "Take in the morning with food"
          },
          {
            name: "Atorvastatin",
            dosage: "20mg",
            frequency: "Once daily",
            instructions: "Take at bedtime"
          }
        ],
        refillsRemaining: 2,
        notes: "Monitor blood pressure weekly. Report any dizziness."
      },
      {
        id: 2,
        userId: userId,
        doctorId: 3,
        prescriptionNumber: "RX-2025-042",
        issueDate: "2025-02-10",
        expiryDate: "2025-03-10",
        status: "expired",
        medicines: [
          {
            name: "Amoxicillin",
            dosage: "500mg",
            frequency: "Three times daily",
            instructions: "Take with meals. Complete full course."
          }
        ],
        refillsRemaining: 0,
        notes: "For bacterial infection. Contact if symptoms persist after 7 days."
      },
      {
        id: 3,
        userId: userId,
        doctorId: 2,
        prescriptionNumber: "RX-2025-105",
        issueDate: "2025-03-05",
        expiryDate: "2025-09-05",
        status: "refill",
        medicines: [
          {
            name: "Tretinoin Cream",
            dosage: "0.025%",
            frequency: "Once daily",
            instructions: "Apply a pea-sized amount to affected areas at bedtime"
          },
          {
            name: "Clindamycin Phosphate",
            dosage: "1%",
            frequency: "Twice daily",
            instructions: "Apply to affected areas in the morning and evening"
          }
        ],
        refillsRemaining: 0,
        notes: "May cause skin dryness. Use sunscreen during the day."
      }
    ];
    
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
  }

  // Load and display prescriptions
  function loadPrescriptions() {
    if (!prescriptionsContainer) return;
    
    // Clear container
    prescriptionsContainer.innerHTML = '';
    
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const statusFilter = filterStatus ? filterStatus.value : 'all';
    
    // Filter prescriptions for current user
    let filteredPrescriptions = prescriptions.filter(prescription => 
      prescription.userId === currentUser.id
    );
    
    // Apply search filter
    if (searchTerm) {
      filteredPrescriptions = filteredPrescriptions.filter(prescription => {
        // Search in medicines
        const medicineMatch = prescription.medicines.some(medicine => 
          medicine.name.toLowerCase().includes(searchTerm)
        );
        
        // Search in prescription number
        const prescriptionMatch = prescription.prescriptionNumber.toLowerCase().includes(searchTerm);
        
        // Search in doctor name
        const doctor = doctors.find(doc => doc.id === prescription.doctorId);
        const doctorMatch = doctor ? doctor.name.toLowerCase().includes(searchTerm) : false;
        
        return medicineMatch || prescriptionMatch || doctorMatch;
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredPrescriptions = filteredPrescriptions.filter(prescription => 
        prescription.status === statusFilter
      );
    }
    
    // Show/hide no prescriptions message
    if (noPrescriptions) {
      noPrescriptions.style.display = filteredPrescriptions.length === 0 ? 'block' : 'none';
    }
    
    // Create prescription cards
    filteredPrescriptions.forEach(prescription => {
      const doctor = doctors.find(doc => doc.id === prescription.doctorId);
      
      // Create card element
      const card = document.createElement('div');
      card.className = `prescription-card ${prescription.status}`;
      card.dataset.id = prescription.id;
      
      // Format dates for display
      const issueDate = new Date(prescription.issueDate);
      const expiryDate = new Date(prescription.expiryDate);
      
      const formattedIssueDate = new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(issueDate);
      
      const formattedExpiryDate = new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(expiryDate);
      
      // Limit medicines display to first 2
      const medicinesToShow = prescription.medicines.slice(0, 2);
      const hiddenMedicines = prescription.medicines.length > 2 ? prescription.medicines.length - 2 : 0;
      
      card.innerHTML = `
        <div class="prescription-header">
          <div>
            <h3 class="prescription-title">${prescription.prescriptionNumber}</h3>
            <p class="prescription-doctor">Prescribed by: ${doctor.name}</p>
          </div>
          <span class="prescription-status status-${prescription.status}">
            ${prescription.status === 'active' ? 'Active' : 
              prescription.status === 'expired' ? 'Expired' : 'Needs Refill'}
          </span>
        </div>
        
        <div class="prescription-dates">
          <span>Issued: ${formattedIssueDate}</span>
          <span>Expires: ${formattedExpiryDate}</span>
        </div>
        
        <div class="prescription-medicines">
          ${medicinesToShow.map(medicine => `
            <div class="medicine-item">
              <span class="medicine-name">${medicine.name}</span>
              <span class="medicine-dosage">${medicine.dosage}</span>
            </div>
          `).join('')}
          ${hiddenMedicines > 0 ? `
            <div class="medicine-item">
              <span class="medicine-name">+ ${hiddenMedicines} more</span>
            </div>
          ` : ''}
        </div>
        
        <div class="prescription-footer">
          <span class="prescription-refills">
            ${prescription.refillsRemaining > 0 ? 
              `Refills: ${prescription.refillsRemaining}` : 
              'No refills remaining'}
          </span>
          <button class="btn btn-primary prescription-view-btn">View Details</button>
        </div>
      `;
      
      prescriptionsContainer.appendChild(card);
      
      // Add click event to view details
      card.addEventListener('click', function() {
        showPrescriptionDetails(prescription.id);
      });
    });
  }

  // Show prescription details in modal
  function showPrescriptionDetails(prescriptionId) {
    // Find prescription
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    
    if (!prescription) return;
    
    const doctor = doctors.find(doc => doc.id === prescription.doctorId);
    
    // Format dates for display
    const issueDate = new Date(prescription.issueDate);
    const expiryDate = new Date(prescription.expiryDate);
    
    const formattedIssueDate = new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(issueDate);
    
    const formattedExpiryDate = new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(expiryDate);
    
    // Build prescription details HTML
    let detailsHTML = `
      <div class="prescription-detail-header">
        <h2 class="prescription-detail-title">Prescription ${prescription.prescriptionNumber}</h2>
        <div class="prescription-detail-info">
          <div class="prescription-detail-info-item">
            <p class="info-label">Prescribed By</p>
            <p class="info-value">${doctor.name}</p>
            <p class="info-label">Specialization</p>
            <p class="info-value">${doctor.specialization}</p>
          </div>
          <div class="prescription-detail-info-item">
            <p class="info-label">Issue Date</p>
            <p class="info-value">${formattedIssueDate}</p>
            <p class="info-label">Expiry Date</p>
            <p class="info-value">${formattedExpiryDate}</p>
          </div>
          <div class="prescription-detail-info-item">
            <p class="info-label">Status</p>
            <p class="info-value">
              <span class="prescription-status status-${prescription.status}">
                ${prescription.status === 'active' ? 'Active' : 
                  prescription.status === 'expired' ? 'Expired' : 'Needs Refill'}
              </span>
            </p>
            <p class="info-label">Refills Remaining</p>
            <p class="info-value">${prescription.refillsRemaining}</p>
          </div>
        </div>
      </div>
      
      <h3>Medications</h3>
      <div class="prescription-detail-medicines">
        ${prescription.medicines.map(medicine => `
          <div class="detail-medicine-item">
            <div class="medicine-detail-left">
              <h4 class="medicine-detail-name">${medicine.name}</h4>
              <p class="medicine-detail-info">${medicine.instructions}</p>
            </div>
            <div class="medicine-detail-right">
              <p class="medicine-detail-dosage">${medicine.dosage}</p>
              <p class="medicine-detail-schedule">${medicine.frequency}</p>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="prescription-detail-notes">
        <h4>Doctor's Notes</h4>
        <p>${prescription.notes}</p>
      </div>
      
      <div class="prescription-detail-actions">
        ${prescription.status === 'active' ? `
          <button class="btn btn-secondary" id="printPrescription">Print Prescription</button>
          ${prescription.refillsRemaining > 0 ? `
            <button class="btn btn-primary" id="requestRefill">Request Refill</button>
          ` : ''}
        ` : prescription.status === 'refill' ? `
          <button class="btn btn-primary" id="requestRefill">Request Refill</button>
        ` : ''}
      </div>
    `;
    
    // Set modal content
    if (prescriptionDetails) {
      prescriptionDetails.innerHTML = detailsHTML;
    }
    
    // Add event listeners to buttons in modal
    const printBtn = document.getElementById('printPrescription');
    if (printBtn) {
      printBtn.addEventListener('click', function() {
        // In a real app, this would trigger a print function
        showAlert('Printing prescription...', 'success', alertContainer);
        closeModalFunc();
      });
    }
    
    const refillBtn = document.getElementById('requestRefill');
    if (refillBtn) {
      refillBtn.addEventListener('click', function() {
        requestRefill(prescriptionId);
      });
    }
    
    // Show modal
    if (modal) {
      modal.style.display = 'block';
    }
  }

  // Request prescription refill
  function requestRefill(prescriptionId) {
    // Find prescription
    const prescriptionIndex = prescriptions.findIndex(p => p.id === prescriptionId);
    
    if (prescriptionIndex !== -1) {
      const prescription = prescriptions[prescriptionIndex];
      
      // In a real app, this would send a request to the server
      if (prescription.status === 'refill') {
        showAlert('Refill request already submitted. We will notify you when it\'s ready.', 'warning', alertContainer);
      } else if (prescription.refillsRemaining > 0) {
        // Update refills remaining
        prescriptions[prescriptionIndex].refillsRemaining -= 1;
        
        // Show success message
        showAlert('Refill request submitted successfully. We will notify you when it\'s ready.', 'success', alertContainer);
        
        // Save to localStorage
        localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
        
        // Close modal
        closeModalFunc();
        
        // Reload prescriptions
        loadPrescriptions();
      } else {
        showAlert('No refills remaining. Please contact your doctor for a new prescription.', 'error', alertContainer);
      }
    }
  }

  // Close modal function
  function closeModalFunc() {
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Initialize page
  loadPrescriptions();

  // Event listeners
  if (closeModal) {
    closeModal.addEventListener('click', closeModalFunc);
  }

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModalFunc();
    }
  });

  // Search and filter
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      loadPrescriptions();
    });
  }

  if (filterStatus) {
    filterStatus.addEventListener('change', function() {
      loadPrescriptions();
    });
  }
});