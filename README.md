Decidí separar lo más posible el proyecto en distintos archivos siguiendo la estructura que hizo el auxiliar con el objetivo de dejarlo ordenado y así facilitar la comprensión.

En la carpeta database están todos los archivos relacionados a la base de datos, incluyendo tarea2.sql y region-scomuna.sql dados por el profesor.

En validations.py se realizan las validaciones de los datos y la verificación de entradas de texto “maliciosas” en los formularios. Además, se hacen verificaciones extra con diferentes funciones de sanitize, ya que si se detecta algo malicioso que se haya filtrado, esto va a ser retirado. Hay diversas regex para controlar las informaciones que se entregan en los inputs.

Utilicé varias lógicas dadas en clases y auxiliares como la mayoría de las funciones de validación de backend dadas en los auxiliares 4 y 5.

La validación del backend muestra error al momento de apretar "Agregar esta actividad" en la última página del formulario, informando qué campos tiene datos inválidos (como inyecciones de html, o errores de información).

En la portada solo se muestra la primera foto que selecciona el usuario, ya que de esta forma lo hice en la Tarea 1, y en el listado de actividades se muestran todas las imágenes añadidas (consultado con el auxiliar).

Probé la tarea en Chrome, Safari y Edge, con diferentes resoluciones (normalmente, todas las páginas deberían funcionar de manera responsiva).

Todos los archivos html y css fueron probados en los links dados, copiando el códgio que aparece al apretar "Ver código fuente de página" cuando la aplicación está corriendo.