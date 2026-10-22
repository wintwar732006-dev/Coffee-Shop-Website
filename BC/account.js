const loginForm = document.getElementById('login-form');
const createAccountForm = document.getElementById('create-account-form');

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();

        if (!loginForm.reportValidity()) return;

        document.getElementById('login-status').textContent =
            'Login is not available because this site is not connected to an authentication service.';
    });
}

if (createAccountForm) {
    const passwordInput = createAccountForm.elements.namedItem('password');
    const confirmPasswordInput = createAccountForm.elements.namedItem('confirmPassword');
    const status = document.getElementById('create-account-status');

    function validatePasswordMatch() {
        confirmPasswordInput.setCustomValidity(
            confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value
                ? 'Passwords do not match.'
                : ''
        );
    }

    passwordInput.addEventListener('input', validatePasswordMatch);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    createAccountForm.addEventListener('submit', event => {
        event.preventDefault();
        validatePasswordMatch();

        if (!createAccountForm.reportValidity()) return;

        status.textContent =
            'Your details are valid, but account creation is not available until this site is connected to an account service.';
    });
}
