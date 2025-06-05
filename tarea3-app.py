from flask import Flask, request, render_template, redirect, url_for, jsonify, flash
from flask_cors import cross_origin
from database import db
from utils.validations import validate_actividad, procesar_formulario, validate_nombre_comentador, validate_comentario
from datetime import datetime

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

@app.route("/actividad/<int:id>/comentar", methods=["POST"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def comentar_actividad(id):
    nombre = request.form.get("nombre", "").strip()
    comentario = request.form.get("comentario", "").strip()

    error_nombre = validate_nombre_comentador(nombre)
    if error_nombre:
        return jsonify(success=False, error=error_nombre)
    error_comentario = validate_comentario(comentario)
    if error_comentario:
        return jsonify(success=False, error=error_comentario)

    session = db.SessionLocal()
    actividad = session.query(db.Actividad).filter_by(id=id).first()
    if actividad:
        nuevo_comentario = db.Comentario(
            nombre=nombre,
            texto=comentario,
            fecha=datetime.now(),
            actividad_id=id
        )
        session.add(nuevo_comentario)
        session.commit()
        session.close()
        return jsonify(success=True)
    else:
        session.close()
        return jsonify(success=False, error="Actividad no encontrada.")

@app.route("/actividad/<int:id>/comentarios", methods=["GET"])
def obtener_comentarios(id):
    session = db.SessionLocal()
    comentarios = (
        session.query(db.Comentario)
        .filter_by(actividad_id=id)
        .order_by(db.Comentario.fecha.desc())
        .all()
    )
    session.close()
    return jsonify([
        {
            "fecha": c.fecha.strftime("%d/%m/%Y %H:%M"),
            "nombre": c.nombre,
            "texto": c.texto
        }
        for c in comentarios
    ])

# Ruta para la página de Estadísticas
@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

# Ruta para el primer grafico de estadísticas
@app.route("/estadisticas/actividades-por-dia")
def actividades_por_dia():
    session = db.SessionLocal()

    resultados = (
        session.query(
            db.func.dayofweek(db.Actividad.dia_hora_inicio).label("dia_semana"),
            db.func.count(db.Actividad.id)
        )
        .group_by("dia_semana")
        .order_by("dia_semana")
        .all()
    )

    session.close()

    dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    data = [{"dia": dias[int(row[0]) - 1], "cantidad": row[1]} for row in resultados]
    return jsonify(data)

# Ruta para el segundo grafico de estadísticas
@app.route("/estadisticas/actividades-por-tema")
def actividades_por_tema():
    session = db.SessionLocal()
    resultados = (
        session.query(
            db.ActividadTema.tema,
            db.func.count(db.ActividadTema.id)
        )
        .join(db.Actividad)
        .group_by(db.ActividadTema.tema)
        .order_by(db.func.count(db.ActividadTema.id).desc())
        .all()
    )
    session.close()

    data = [{"tema": row[0].value, "cantidad": row[1]} for row in resultados]
    return jsonify(data)

# Ruta para el tercer grafico de estadísticas
@app.route("/estadisticas/actividades-por-horario")
def actividades_por_horario():
    session = db.SessionLocal()
    resultados = session.query(
        db.func.extract('month', db.Actividad.dia_hora_inicio).label("mes"),
        db.func.extract('hour', db.Actividad.dia_hora_inicio).label("hora"),
    ).all()
    session.close()
    datos = [{"mes": i + 1, "manana": 0, "tarde": 0, "noche": 0} for i in range(12)]
    for mes, hora in resultados:
        mes = int(mes)
        hora = int(hora)

        if 6 <= hora < 12:
            datos[mes - 1]["manana"] += 1
        elif 12 <= hora < 18:
            datos[mes - 1]["tarde"] += 1
        else:
            datos[mes - 1]["noche"] += 1

    return jsonify(datos)


# Ejecutar la aplicación
if __name__ == "__main__":
    app.run(debug=True)
