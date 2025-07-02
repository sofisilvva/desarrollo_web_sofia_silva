package cc5002.tarea4.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "actividad")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200)
    private String nombre;

    @Column(length = 100)
    private String sector;

    @Column(name = "dia_hora_inicio")
    private LocalDateTime diaHoraInicio;

    @Column(name = "dia_hora_termino")
    private LocalDateTime diaHoraTermino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comuna_id", nullable = false)
    private Comuna comuna;

    @OneToMany(mappedBy = "actividad", fetch = FetchType.EAGER)
    private List<ActividadTema> temas;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Nota> notas;

    // No lo guardamos en la BD, solo lo mostramos
    @Transient
    private Double promedioNotas;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNombre() { return nombre; }
    public String getSector() { return sector; }
    public LocalDateTime getDiaHoraInicio() { return diaHoraInicio; }
    public LocalDateTime getDiaHoraTermino() { return diaHoraTermino; }
    public Comuna getComuna() { return comuna; }
    public List<ActividadTema> getTemas() { return temas; }
    public List<Nota> getNotas() { return notas; }
    public void setNotas(List<Nota> notas) { this.notas = notas; }
    public Double getPromedioNotas() { return promedioNotas; }
    public void setPromedioNotas(Double promedioNotas) { this.promedioNotas = promedioNotas; }

    // Obtener los temas como un string
    public String getTemasComoString() {
        if (temas == null || temas.isEmpty()) {
            return "Sin tema";
        }
        return temas.stream()
                .map(t -> "Otro".equals(t.getTema().getValue()) ? t.getGlosaOtro() : t.getTema().getValue())
                .collect(Collectors.joining(", "));
    }
}