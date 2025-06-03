export const showNotification = (message, type = 'success') => {
  const backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
  
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor,
    stopOnFocus: true
  }).showToast();
};

export const showSuccess = (message) => showNotification(message, 'success');
export const showError = (message) => showNotification(message, 'error');