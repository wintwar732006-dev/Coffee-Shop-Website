const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const subject = `Cafe website message from ${formData.get('name')}`;
    const body = [
        `Name: ${formData.get('name')}`,
        `Email: ${formData.get('email')}`,
        '',
        formData.get('message')
    ].join('\n');
    const mailto = `mailto:wintwar732006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    document.getElementById('contact-status').textContent =
        'Opening your email app with the message ready to send.';
    window.location.href = mailto;
});
