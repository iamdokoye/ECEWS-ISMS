// studentProfile.js (frontend logic)
$(document).ready(function() {
  // Elements
  const uploadTrigger = $('#uploadTrigger');
  const selectImage = $('#selectImage');
  const profilePhotoImg = $('.photoBox img');
  
  // Event listeners
  uploadTrigger.on('click', function() {
    selectImage.click();
  });
  
  selectImage.on('change', handleImageUpload);
  
  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      // Validate file
      if (!file.type.match('image.*')) {
        throw new Error('Only image files are allowed');
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }
      
      // Show loading state
      uploadTrigger.addClass('uploading');
      
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('image', file);
      formData.append('isProfile', 'true');
      
      // Get auth token (assuming you have it in localStorage)
      const token = localStorage.getItem('authToken');
      
      // Send to backend
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const result = await response.json();
      
      // Update the profile image preview
      const reader = new FileReader();
      reader.onload = function(e) {
        profilePhotoImg.attr('src', e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Show success message
      showToast('Profile image updated successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.message || 'Failed to upload image', 'error');
    } finally {
      uploadTrigger.removeClass('uploading');
      selectImage.val(''); // Reset file input
    }
  }
  
  function showToast(message, type = 'success') {
    // Implement your toast notification system here
    // Example:
    const toast = $(`<div class="toast ${type}">${message}</div>`);
    $('body').append(toast);
    setTimeout(() => toast.remove(), 3000);
  }
  
  // Function to fetch current profile image
  async function fetchProfileImage() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/profile/image`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          profilePhotoImg.attr('src', data.imageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  }
  
  // Call this on page load
  fetchProfileImage();
});