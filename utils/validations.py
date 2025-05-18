import re
import filetype
from datetime import datetime
import hashlib
from werkzeug.utils import secure_filename
import os

# Validaciones para el formulario de creación de actividades
def validate_nombre(value):
    if not value:
        return False
    value = value.strip()
    if len(value) == 0 or len(value) > 200:
        return False
    # Permitir letras Unicode, números, espacios, guiones, puntos y apóstrofos
    patron = r"^[\w\s\-\.'\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+$"

    # Detalle del patrón:
    return re.match(patron, value, re.UNICODE) is not None

def validate_email(value):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.fullmatch(email_regex, value) is not None

def validate_celular(value):
    if not value or value.strip() == "":
        return True
    return re.fullmatch(r"\+569\.\d{8}", value) is not None

def validate_contactos(contactos):
    if len(contactos) == 0:
        return True
    if len(contactos) > 5:
        return False
    # Permitir letras, números, espacios, @, ., -, _
    patron = r"^[a-zA-Z0-9@.\-_+]+$"
    for contacto in contactos:
        if contacto.get("nombre") == "otra":
            # Validar el campo "red" para "otra"
            identificador_otro = contacto.get("identificador", "").strip()
            red_otro = identificador_otro.split(': ')[0]
            identificador = identificador_otro.split(': ')[1]
            if not (3 <= len(red_otro) <= 15):
                print (f"Red 'otra' inválida: {red_otro}")
                return False
            if not re.match(patron, red_otro):
                print (f"Red 'otra' no coincide con el patrón: {red_otro}")
                return False
        else:
            identificador = contacto.get("identificador", "").strip()
        if not (4 <= len(identificador) <= 50):
            print (f"Identificador inválido: {identificador}")
            return False
        if not re.match(patron, identificador):
            print (f"Identificador no coincide con el patrón: {identificador}")
            return False

    return True

def validate_sector(value):
    if not value or value.strip() == "":
        return True  # Campo opcional, se permite vacío
    value = value.strip()
    if len(value) > 100:
        return False
    # Solo caracteres latinos, números, espacios, tildes, guiones, puntos, apostrofes, etc
    patron = r"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.\-'#¡!()]+$"
    return re.match(patron, value) is not None

def validate_descripcion(value):
    if not value or value.strip() == "":
        return True  # Campo opcional, se permite vacío
    value = value.strip()
    if len(value) > 500: # Limitar a 500 caracteres 
        return False
    # Solo caracteres latinos, números, espacios, tildes, guiones, puntos, apóstrofes, etc
    patron = r"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.\-'\"¿?¡!;,:+*#$%&/()=]+$"
    return re.match(patron, value) is not None

def validate_fecha_inicio(fecha):
    try:
        datetime.fromisoformat(fecha)
        return True
    except (ValueError, TypeError):
        return False

def validate_fecha_termino(fechaTermino, fecha_inicio):
    if not fechaTermino:
        return True
    try:
        dt_termino = datetime.fromisoformat(fechaTermino)
        dt_inicio = datetime.fromisoformat(fecha_inicio)
        return dt_termino > dt_inicio
    except (ValueError, TypeError):
        return False
    
def validate_temas(temas):
    if not temas or len(temas) == 0:
        return False
    patron = r"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.\-'¡!\"#$%&/()=¿?,:;]+$"
    for tema in temas:
        if tema.get("tema") == "otro":
            otroTema = tema.get("glosa_otro", "").strip()
            if not (3 <= len(otroTema) <= 15):
                return False
            if not re.match(patron, otroTema):
                return False
    return True

def validate_comuna_id(comuna_id):
    try:
        return int(comuna_id) > 0
    except:
        return False

def validate_fotos(fotos):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif"}
    print("Validando fotos:", fotos)
    if not fotos or len(fotos) == 0:
        print("No hay fotos para validar.")
        return False
    for foto in fotos:
        nombre = foto.get("nombre_archivo", "")
        ruta = foto.get("ruta_archivo", "")
        ruta = ruta.replace("uploads/", "static/uploads/")
        if not foto or nombre == "":
            print("Foto vacía o sin nombre.")
            return False
        try:
            with open(ruta, "rb") as f:
                ftype_guess = filetype.guess(f.read(261)) 
        except Exception as e:
            print(f"Error al abrir archivo: {e}")
            return False
        if ftype_guess.extension not in ALLOWED_EXTENSIONS:
            print(f"Extensión no permitida: {ftype_guess.extension}")
            return False
        if ftype_guess.mime not in ALLOWED_MIMETYPES:
            print(f"MIME type no permitido: {ftype_guess.mime}")
            return False
    print("Todas las fotos son válidas.")   
    return True

# Separacion de la validación de la actividad en una función para mayor claridad
# Se valida cada campo y se devuelve una lista de errores
def validate_actividad(data, fotos, temas, contactos):
    errores = []
    comuna_ok = validate_comuna_id(data.get("comuna_id"))
    if not comuna_ok:
        errores.append("comuna_id")
    sector_ok = validate_sector(data.get("sector"))
    if not sector_ok:
        errores.append("sector")
    nombre_ok = validate_nombre(data.get("nombre"))
    if not nombre_ok:
        errores.append("nombre")
    email_ok = validate_email(data.get("email"))
    if not email_ok:
        errores.append("email")
    celular_ok = validate_celular(data.get("celular"))
    if not celular_ok:
        errores.append("celular")
    contactos_ok = validate_contactos(contactos)
    if not contactos_ok:
        errores.append("contactos")
    fecha_inicio_ok = validate_fecha_inicio(data.get("dia_hora_inicio"))
    if not fecha_inicio_ok:
        errores.append("dia_hora_inicio")
    fecha_termino_ok = validate_fecha_termino(data.get("dia_hora_termino"), data.get("dia_hora_inicio"))
    if not fecha_termino_ok:
        errores.append("dia_hora_termino")
    descripcion_ok = validate_descripcion(data.get("descripcion"))
    if not descripcion_ok:
        errores.append("descripcion")
    temas_ok = validate_temas(temas)
    if not temas_ok:
        errores.append("temas")
    fotos_ok = validate_fotos(fotos)
    if not fotos_ok:
        errores.append("fotos")
    es_valido = len(errores) == 0
    if es_valido:
        print("Validación exitosa.")
    else:
        print("Errores de validación:", errores)
    return es_valido, errores

# Evitar inyecciones SQL y XSS, sanitizando los inputs
def sanitizar_input(texto):
    if not texto:
        return "" 
    # Eliminar scripts y etiquetas HTML
    texto = re.sub(r"<.*?>", "", texto)  # remueve cualquier etiqueta <...>
    texto = re.sub(r"(?i)<script.*?</script>", "", texto)  # elimina scripts enteros
    texto = texto.replace("'", "").replace('"', "")  # remueve comillas
    texto = texto.replace(";", "").replace("--", "")  # remueve intentos de inyecciones SQL
    return texto.strip()

def procesar_formulario(request, app):
    datos = {
        "comuna_id": request.form.get("select-comuna"),
        "sector": sanitizar_input(request.form.get("sector", "")),
        "nombre": sanitizar_input(request.form.get("nombre", "")),
        "email": sanitizar_input(request.form.get("email", "")),
        "celular": sanitizar_input(request.form.get("phone", "")),
        "dia_hora_inicio": request.form.get("inicio"),
        "dia_hora_termino": request.form.get("termino"),
        "descripcion": sanitizar_input(request.form.get("descripcion", ""))
    }
    if datos["dia_hora_termino"] == "":
        datos["dia_hora_termino"] = None
    fotos = []
    for archivo in request.files.getlist("fotos"):
        if archivo:
            _filename = hashlib.sha256(secure_filename(archivo.filename).encode()).hexdigest()
            _extension = filetype.guess(archivo).extension
            nombre_archivo = f"{_filename}.{_extension}"
            ruta = os.path.join(app.config["UPLOAD_FOLDER"], nombre_archivo)
            archivo.save(ruta)
            fotos.append({
                "ruta_archivo": f"uploads/{nombre_archivo}",
                "nombre_archivo": archivo.filename
            })
    temas = []
    for t in request.form.getlist("tema"):
        if t == "otro":
            otroTema = sanitizar_input(request.form.get("otro-id", "").strip())
            if otroTema:
                temas.append({"tema": "otro", "glosa_otro": otroTema})
        else:
            temas.append({"tema": t, "glosa_otro": None})
    contactos = []
    medios = ["whatsapp", "telegram", "x", "instagram", "tiktok"]
    for medio in medios:
        if medio in request.form:
            identificador = sanitizar_input(request.form.get(f"{medio}-id", "").strip())
            if identificador:
                contactos.append({
                    "nombre": medio,
                    "identificador": identificador
                })
    if "otra" in request.form:
        red_otro = sanitizar_input(request.form.get("red", "").strip())
        usuario_otro = sanitizar_input(request.form.get("usuario", "").strip())
        if red_otro and usuario_otro:
            contactos.append({
                "nombre": "otra",
                "identificador": red_otro+": "+usuario_otro,
            })
    return datos, fotos, temas, contactos
