document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formComentario');
    if (!form) return;
    const match = window.location.pathname.match(/\/actividad\/(\d+)/);
    const actividadId = match ? match[1] : null;
    if (!actividadId) return;

    function cargarComentarios() {
        fetch(`/actividad/${actividadId}/comentarios`)
            .then(r => r.json())
            .then(data => {
                const cont = document.getElementById('listaComentarios');
                if (!cont) return;
                if (!data.length) {
                    cont.innerHTML = "<p>No hay comentarios para esta actividad.</p>";
                    return;
                }
                cont.innerHTML = data.map(c =>
                    `<div class="comentario">
                        <div><strong>${c.nombre}</strong> <span style="color:gray;font-size:0.9em;">${c.fecha}</span></div>
                        <div>${c.texto}</div>
                    </div>`
                ).join('<hr>');
            });
    }

    // Carga los comentarios al inicio
    cargarComentarios();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombreComentario').value.trim();
        const comentario = document.getElementById('textoComentario').value.trim();
        const errorDiv = document.getElementById('errorComentario');
        errorDiv.textContent = '';

        if (!nombre || nombre.length < 3 || nombre.length > 80) {
            errorDiv.textContent = 'El nombre debe tener entre 3 y 80 caracteres.';
            return;
        }
        if (!comentario || comentario.length < 5 || comentario.length > 200) {
            errorDiv.textContent = 'El comentario debe tener entre 5 y 200 caracteres.';
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('comentario', comentario);

        fetch(`/actividad/${actividadId}/comentar`, {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                form.reset();
                cargarComentarios(); // Recargar comentarios después de agregar uno nuevo
            } else {
                errorDiv.textContent = data.error || "No pude agregar el comentario.";
            }
        })
        .catch(() => {
            errorDiv.textContent = "Error.";
        });
    });
});