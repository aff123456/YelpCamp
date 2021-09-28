(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');

    const borders = document.querySelectorAll('.needs-borders');
    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        });
    
    Array.from(borders)
        .forEach((img) => {
            img.addEventListener('click', () => {
                img.classList.toggle('border-primary');
            });
        })
})()