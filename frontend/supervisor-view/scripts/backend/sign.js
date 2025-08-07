document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('token');
  const studentId = sessionStorage.getItem('StudentId');
  const apiBase = window.API_BASE;

  const signBtn = document.querySelector('.sign-button');
  const commentInput = document.querySelector('.comment-input');
  const signatureBox = document.querySelector('.signature');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeBtn');
  const clearBtn = document.getElementById('clearSignature');
  const saveBtn = document.getElementById('sendFeedback');

  let currentMonth = 1;
  let currentWeek = 1;
  let signaturePad;

  // 1️⃣ Initialize SignaturePad
  function initSignaturePad() {
    const canvas = document.getElementById('signatureCanvas');
    signaturePad = new SignaturePad(canvas);

    function resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  // 2️⃣ Show Modal
  signBtn?.addEventListener('click', () => {
    overlay.classList.add('show');
    initSignaturePad();
  });

  // 3️⃣ Hide Modal
  closeBtn?.addEventListener('click', () => {
    overlay.classList.remove('show');
  });

  // 4️⃣ Clear Signature
  clearBtn?.addEventListener('click', () => {
    signaturePad.clear();
  });

  // 5️⃣ Save Comment + Signature
  saveBtn?.addEventListener('click', async () => {
    const comment = commentInput.value.trim();
    if (!comment) {
      alert('Please enter a comment.');
      return;
    }
    if (signaturePad.isEmpty()) {
      alert('Please provide a signature.');
      return;
    }

    const signatureData = signaturePad.toDataURL();

    try {
      const res = await fetch(`${apiBase}/supervisor/sign-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId,
          comment,
          signature: signatureData,
          month: currentMonth,
          week: currentWeek
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signature saved successfully!');
        overlay.classList.remove('show');
        await loadSignatureForWeek(currentMonth, currentWeek);
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Please try again.');
    }
  });

  // 6️⃣ Load saved comment + signature if already signed
  async function loadSignatureForWeek(month, week) {
    try {
      const res = await fetch(`${apiBase}/supervisor/sign-log/${studentId}/${month}/${week}`);
      const data = await res.json();

      if (data.signed) {
        commentInput.value = data.comment;
        commentInput.disabled = true;
        signBtn.style.display = 'none';

        const img = document.createElement('img');
        img.src = data.signature;
        img.alt = 'Supervisor Signature';
        img.style.maxWidth = '300px';

        signatureBox.innerHTML = '';
        signatureBox.appendChild(img);
      } else {
        // Editable if not signed
        commentInput.disabled = false;
        signBtn.style.display = 'inline-block';
        signatureBox.innerHTML = '';
      }
    } catch (err) {
      console.error('Error loading supervisor data:', err);
    }
  }

  // 7️⃣ Example: Load data when page loads or when month/week changes
  loadSignatureForWeek(currentMonth, currentWeek);
});
