new Typed('#titre', {
strings: ["Formulaire de Contact"],
typeSpeed: 80,
});
document.querySelector('.file-section input[type="file"]').addEventListener('change', event => {
    const element = event.target;
    const input = element.closest('.file-section').querySelector('input.file-path');
    input.value = [...element.files].map(e => e.name).join(', ');
});