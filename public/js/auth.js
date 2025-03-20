document.addEventListener('DOMContentLoaded', function() {
  // Toggle password visibility
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
  
  // Password strength meter
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const progressBar = document.querySelector('.password-strength .progress-bar');
  const feedback = document.querySelector('.password-feedback');
  
  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      let strength = 0;
      let message = '';
      
      // Length check
      if (password.length >= 6) {
        strength += 20;
      }
      
      // Lowercase check
      if (password.match(/[a-z]/)) {
        strength += 20;
      }
      
      // Uppercase check
      if (password.match(/[A-Z]/)) {
        strength += 20;
      }
      
      // Number check
      if (password.match(/[0-9]/)) {
        strength += 20;
      }
      
      // Special character check
      if (password.match(/[^a-zA-Z0-9]/)) {
        strength += 20;
      }
      
      // Update progress bar
      progressBar.style.width = strength + '%';
      
      // Update color based on strength
      if (strength <= 40) {
        progressBar.className = 'progress-bar bg-danger';
        message = 'Mật khẩu yếu';
      } else if (strength <= 80) {
        progressBar.className = 'progress-bar bg-warning';
        message = 'Mật khẩu trung bình';
      } else {
        progressBar.className = 'progress-bar bg-success';
        message = 'Mật khẩu mạnh';
      }
      
      feedback.textContent = message;
    });
  }
  
  // Password confirmation check
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', function() {
      if (this.value !== passwordInput.value) {
        this.setCustomValidity('Mật khẩu không khớp');
      } else {
        this.setCustomValidity('');
      }
    });
  }
  
  // Form validation
  const registerForm = document.querySelector('form[action="/auth/register"]');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {

      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      
      if (password !== confirmPassword) {
        e.preventDefault();
        alert('Mật khẩu không khớp!');
        return false;
      }
      
      if (password.length < 6) {
        e.preventDefault();
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return false;
      }
      
      this.submit();
    });
  }
}); 