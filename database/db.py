import enum
from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload

# Credenciales de la base de datos pedidas en el enunciado
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# --- Enums ---
class TemaEnum(enum.Enum):
    música = "Música"
    deporte = "Deporte"
    ciencias = "Ciencias"
    religión = "Religión"
    política = "Política"
    tecnología = "Tecnología"
    juegos = "Juegos"
    baile = "Baile"
    comida = "Comida"
    otro = "Otro"

class RedSocialEnum(enum.Enum):
    whatsapp = "WhatsApp"
    telegram = "Telegram"
    X = "X"
    instagram = "Instagram"
    tiktok = "TikTok"
    otra = "Otra"

# --- Modelos ---
class Region(Base):
    __tablename__ = 'region'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = 'comuna'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)
    region = relationship("Region", back_populates="comunas")
    actividades = relationship("Actividad", back_populates="comuna")

class Actividad(Base):
    __tablename__ = 'actividad'
    id = Column(Integer, primary_key=True)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    sector = Column(String(100))
    nombre = Column(String(200))
    email = Column(String(100))
    celular = Column(String(15))
    dia_hora_inicio = Column(DateTime)
    dia_hora_termino = Column(DateTime)
    descripcion = Column(String(500))
    comuna = relationship("Comuna", back_populates="actividades")
    fotos = relationship("Foto", back_populates="actividad", cascade="all, delete-orphan")
    contactos = relationship("ContactarPor", back_populates="actividad", cascade="all, delete-orphan")
    temas = relationship("ActividadTema", back_populates="actividad", cascade="all, delete-orphan")

class Foto(Base):
    __tablename__ = 'foto'
    id = Column(Integer, primary_key=True)
    ruta_archivo = Column(String(300))
    nombre_archivo = Column(String(300))
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    actividad = relationship("Actividad", back_populates="fotos")

class ContactarPor(Base):
    __tablename__ = 'contactar_por'
    id = Column(Integer, primary_key=True)
    nombre = Column(Enum(RedSocialEnum))
    identificador = Column(String(150))
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    actividad = relationship("Actividad", back_populates="contactos")

class ActividadTema(Base):
    __tablename__ = 'actividad_tema'
    id = Column(Integer, primary_key=True)
    tema = Column(Enum(TemaEnum))
    glosa_otro = Column(String(15))
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    actividad = relationship("Actividad", back_populates="temas")

# --- Funciones útiles ---
def get_actividades(limit=10, offset=0):
    session = SessionLocal()
    actividades = session.query(Actividad).options(
        joinedload(Actividad.comuna).joinedload(Comuna.region),
        joinedload(Actividad.fotos),
        joinedload(Actividad.temas),
        joinedload(Actividad.contactos)
    ).order_by(Actividad.dia_hora_inicio.desc()).offset(offset).limit(limit).all()    
    for a in actividades:
        session.expunge(a)
    session.close()
    return actividades

def get_actividad_por_id(id):
    session = SessionLocal()
    actividad = session.query(Actividad).options(
        joinedload(Actividad.comuna).joinedload(Comuna.region),
        joinedload(Actividad.comuna),
        joinedload(Actividad.fotos),
        joinedload(Actividad.temas),
        joinedload(Actividad.contactos)
    ).filter_by(id=id).first()
    session.close()
    return actividad

def crear_actividad(data, fotos=[], temas=[], contactos=[]):
    session = SessionLocal()
    nueva = Actividad(**data)
    for f in fotos:
        nueva.fotos.append(Foto(**f))
    for t in temas:
        nueva.temas.append(ActividadTema(**t))
    for c in contactos:
        nueva.contactos.append(ContactarPor(**c))
    session.add(nueva)
    session.commit()
    session.close()

def get_regiones():
    session = SessionLocal()
    regiones = session.query(Region).all()
    session.close()
    return regiones

def get_comunas_por_region(region_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter_by(region_id=region_id).all()
    resultado = [{"id": c.id, "nombre": c.nombre} for c in comunas]
    session.close()
    return resultado

def guardar_contactos(request_form, actividad_id, session):
    contactos = []
    if 'whatsapp' in request_form and request_form.get('whatsapp-id'):
        contactos.append(ContactarPor(
            nombre=RedSocialEnum.whatsapp,
            identificador=request_form.get('whatsapp-id'),
            actividad_id=actividad_id
        ))
    if 'telegram' in request_form and request_form.get('telegram-id'):
        contactos.append(ContactarPor(
            nombre=RedSocialEnum.telegram,
            identificador=request_form.get('telegram-id'),
            actividad_id=actividad_id
        ))
    if 'x' in request_form and request_form.get('x-id'):
        contactos.append(ContactarPor(
            nombre=RedSocialEnum.x,
            identificador=request_form.get('x-id'),
            actividad_id=actividad_id
        ))
    if 'instagram' in request_form and request_form.get('instagram-id'):
        contactos.append(ContactarPor(
            nombre=RedSocialEnum.instagram,
            identificador=request_form.get('instagram-id'),
            actividad_id=actividad_id
        ))
    if 'tiktok' in request_form and request_form.get('tiktok-id'):
        contactos.append(ContactarPor(
            nombre=RedSocialEnum.tiktok,
            identificador=request_form.get('tiktok-id'),
            actividad_id=actividad_id
        ))
    if 'otra' in request_form and request_form.get('red') and request_form.get('usuario'):
        contactos.append(ContactarPor(
            nombre=RedSocialEnum.otra,
            identificador=request_form.get('red') + ":" + request_form.get('usuario'),
            actividad_id=actividad_id
        ))
    session.add_all(contactos)
    session.commit()