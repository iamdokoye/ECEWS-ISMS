$(document).ready(function () {
  const API_BASE = window.API_BASE || "http://localhost:5000/api"; // Adjust if needed

  // Trigger file select when user clicks upload box
  $('#uploadTrigger').on('click', function () {
    $('#selectImage').click();
  });

  // Handle file change + upload
  $('#selectImage').on('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onload = function (e) {
      $('.photoBox img').attr('src', e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload logic
    const formData = new FormData();
    formData.append('image', file);
    formData.append('isProfile', 'true'); // optional field if used in backend

    const token = sessionStorage.getItem('token'); // Make sure this is set

    fetch(`${API_BASE}/image/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
    .then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Upload failed');
      alert('✅ Image uploaded successfully!');
      console.log('Uploaded image info:', result.data);

      // Optional: Replace preview with actual served image URL if needed
      // $('.photoBox img').attr('src', `${API_BASE}/${result.data.image_id}`);

    })
    .catch((err) => {
      console.error('Upload error:', err);
      alert('❌ Upload failed: ' + err.message);
    });
  });

  // Optional: Modal behavior for other interactions
  $("#editBio").click(function () {
    $("#overlay").fadeIn(200);
    $("#addModal").fadeIn(200);
  });

  $("#closeModal").click(function () {
    $("#addModal").fadeOut(200);
    $("#overlay").delay(100).fadeOut(200);
  });

  $("#overlay").click(function (e) {
    if (e.target === this) {
      $("#addModal").fadeOut(200);
      $("#overlay").delay(100).fadeOut(200);
    }
  });
});
