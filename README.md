- Decidí separar lo más posible el proyecto en distintos archivos JavaScript con el objetivo de dejarlo ordenado y así facilitar la comprensión. Esta forma de organización modular me permite mantener el código más claro, reutilizable y escalable.

- El archivo validation.js contiene dos tipos principales de funciones: aquellas que comienzan con validate y otras que empiezan con update:

    - Las funciones validate las escribí con el propósito específico de hacer validaciones y controles de los datos ingresados por el usuario. Cuando se trata de verificaciones simples, retornan solamente true o false. En cambio, cuando los controles son más complejos o múltiples, estas funciones pueden devolver varios valores booleanos. Por eso, me aseguré de revisar bien cómo funciona cada una antes de utilizarlas, para evitar errores en la implementación.

    - Las funciones update utilizan internamente las funciones validate para realizar los chequeos, y además se encargan de crear y eliminar mensajes de error dinámicamente. Para eso, desarrollé funciones específicas que gestionan visualmente los errores dentro del formulario.

- El archivo main.js contiene principalmente todas las funciones de navegación y los addEventListener, del tipo blur, con el objetivo de mejorarla experiencia de navegación permitiendo que el usuario pueda corregir sus datos de forma fluida.

- Adjunté imágenes de diferentes tamaños dependiendo para lo que se utilizarían, por ejemplo, en la parte de Listado de Actividades, existe una version pequeña (320x240) y otra más grande (800x600) de cada foto, permitiendo que las imágenes carguen de manera más rápida al ingresar.

- Utilicé varias lógicas dadas en clases y auxiliares como las funciones para poblar las regiones y comunas y la funcion para gestionar los check box.

- Con respecto al diseño en CSS, crée un diseño de section y de header que utilicé en todas las páginas para hacerlo más estético y llamativo.

- Probé la tarea en Chrome, Safari y Edge, con diferentes resoluciones (normalmente, todas las páginas deberían funcionar de manera responsiva)