package cc5002.tarea4.model;

import jakarta.persistence.*;

@Entity
@Table(name = "actividad_tema")
public class ActividadTema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tema")
    private TemaEnum tema;

    @Column(name = "glosa_otro", length = 15)
    private String glosaOtro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actividad_id", nullable = false)
    private Actividad actividad;

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public TemaEnum getTema() {
        return tema;
    }

    public void setTema(TemaEnum tema) {
        this.tema = tema;
    }

    public String getGlosaOtro() {
        return glosaOtro;
    }

    public void setGlosaOtro(String glosaOtro) {
        this.glosaOtro = glosaOtro;
    }

    public Actividad getActividad() {
        return actividad;
    }

    public void setActividad(Actividad actividad) {
        this.actividad = actividad;
    }
}