from flask import Flask, request, render_template, redirect, url_for, jsonify, flash
from database import db
from utils.validations import validate_actividad, procesar_formulario

UPLOAD_FOLDER = "static/uploads"

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = "clave_secreta_desarrollo"

# Ruta a la Portada de la página web 
@app.route("/", methods=["GET"])
def index():
    actividades = db.get_actividades(limit=5)
    return render_template("index.html", actividades=actividades)

@app.route("/validar", methods=["POST"])
def validar():
    datos, fotos, temas, contactos = procesar_formulario(request, app)
    es_valido, errores = validate_actividad(datos, fotos, temas, contactos)
    return jsonify({
        "ok": es_valido,
        "errores": errores if not es_valido else {}
    })

# Ruta a la página para Agregar una actividad
@app.route("/agregar", methods=["GET", "POST"])
def agregar_actividad():
    if request.method == "POST":
        datos, fotos, temas, contactos = procesar_formulario(request, app)
        es_valido, errores = validate_actividad(datos, fotos, temas, contactos)
        if es_valido:
            db.crear_actividad(datos, fotos=fotos, temas=temas, contactos=contactos)
            flash("Hemos recibido su información, muchas gracias y suerte en su actividad.")
            return redirect(url_for('index'))
    regiones = db.get_regiones()
    return render_template("agregar-actividad.html", regiones=regiones)

# Ruta para mostrar las comunas de una región
@app.route("/comunas/<int:region_id>")
def comunas_por_region(region_id):

    comunas = db.get_comunas_por_region(region_id)
    return jsonify(comunas)

# Ruta al Listado de actividades
@app.route("/actividades", methods=["GET"])
@app.route("/actividades")
def lista_actividades():
    page = request.args.get("page", 1, type=int)
    per_page = 5
    offset = (page - 1) * per_page
    # contar el total de actividades para la paginación
    session = db.SessionLocal()
    total = session.query(db.Actividad).count()
    session.close()
    actividades = db.get_actividades(limit=per_page, offset=offset)
    total_pages = (total + per_page - 1) // per_page
    return render_template("lista-actividades.html", actividades=actividades, page=page, total_pages=total_pages)

# Ruta para el Detalle de cada actividad 
@app.route("/actividad/<int:id>")
def detalle_actividad(id):
    actividad = db.get_actividad_por_id(id)
    if not actividad:
        return redirect(url_for("lista_actividades"))
    page = request.args.get("page", 1, type=int)
    return render_template("informacion-actividad.html", actividad=actividad, page=page)

# Ruta para la página de Estadísticas
@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

# Ejecutar la aplicación
if __name__ == "__main__":
    app.run(debug=True)
