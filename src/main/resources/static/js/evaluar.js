document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('table tbody');

    tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('evaluar-btn')) {
            const button = event.target;
            const actividadId = button.dataset.id;
            
            Swal.fire({
                title: `Evaluación de la actividad ${actividadId}`,
                html: `Por favor ingrese una nota entera entre 1 y 7 <br> para calificar la actividad número <b>${actividadId}</b>:`,
                input: 'text',
                customClass: {
                    input: 'swal-input-short'
                },
                showCancelButton: true,
                confirmButtonText: 'Enviar',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                preConfirm: (notaStr) => {
                    if (!notaStr) {
                        Swal.showValidationMessage('La nota no puede estar vacía.');
                        return false;
                    }
                    const notaEstandarizada = notaStr.replace(',', '.');
                    const nota = parseFloat(notaEstandarizada);
                    if (isNaN(nota) || nota % 1 !== 0 || nota < 1 || nota > 7) {
                        Swal.showValidationMessage('Error: Debe ingresar un número entero entre 1 y 7.');
                        return false;
                    }
                    return nota;
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    evaluarActividad(actividadId, result.value);
                }
            });
        }
    });

    async function evaluarActividad(id, nota) {
        try {
            const response = await fetch(`/api/v1/actividades/${id}/evaluar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nota: nota }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al guardar la nota.');
            }

            const notaCell = document.getElementById(`nota-cell-${id}`);
            if (notaCell) {
                const nuevoPromedio = parseFloat(result.nuevoPromedio).toFixed(1);
                notaCell.textContent = nuevoPromedio;
                Swal.fire({
                    title: '¡Muchas gracias!',
                    text: 'Su evaluación ha sido registrada.',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                });
            }

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: `No se pudo registrar la evaluación: ${error.message}`,
                icon: 'error'
            });
        }
    }
});