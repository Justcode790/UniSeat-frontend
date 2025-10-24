// Utility functions for the UniSeat application

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format date for input fields
export const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Generate CSV content from data
export const generateCSV = (data, headers) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// Download CSV file
export const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Calculate seat position in classroom
export const calculateSeatPosition = (seatNumber, capacity) => {
  const columnsPerRow = Math.min(10, Math.ceil(Math.sqrt(capacity * 2)));
  const row = Math.floor((seatNumber - 1) / columnsPerRow) + 1;
  const col = ((seatNumber - 1) % columnsPerRow) + 1;
  
  return { row, col, columnsPerRow };
};

// Get seat color based on status
export const getSeatColor = (isOccupied, isSelected = false) => {
  if (isSelected) return 'bg-blue-500';
  if (isOccupied) return 'bg-green-500';
  return 'bg-gray-200';
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate registration number format
export const isValidRegNumber = (regNumber) => {
  const regRegex = /^[A-Z]{2,3}[1-4][A-C]\d{3}$/;
  return regRegex.test(regNumber);
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get user initials for avatar
export const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if user has admin role
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
