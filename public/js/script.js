// script.js
document.addEventListener('DOMContentLoaded', function() {
    const subastarLink = document.getElementById('subastarLink');

    if (subastarLink) {
        subastarLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace

            const currentPage = document.body;
            const targetPageUrl = this.href;

            // Añadir animación slide-out a la página actual
            currentPage.classList.add('slide-out');

            // Esperar a que termine la animación antes de redirigir
            currentPage.addEventListener('animationend', function() {
                window.location.href = targetPageUrl;
            }, { once: true });
        });
    }

    // Agregar animación slide-in a la página adminG.html cuando se carga
    if (document.body.classList.contains('adminG')) {
        document.body.classList.remove('hidden');
        setTimeout(() => {
            document.body.classList.add('slide-in');
        }, 100);
    }
});
