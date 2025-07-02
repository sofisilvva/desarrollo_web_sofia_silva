package cc5002.tarea4.service;

import cc5002.tarea4.model.Actividad;
import cc5002.tarea4.model.Nota;
import cc5002.tarea4.repository.ActividadRepository;
import cc5002.tarea4.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActividadService {

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private NotaRepository notaRepository;

    @Transactional(readOnly = true)
    public List<Actividad> getActividadesRealizadas() {
        List<Actividad> actividades = actividadRepository.findActividadesRealizadas(LocalDateTime.now());
        // Calculamos el promedio para cada actividad
        actividades.forEach(this::calcularPromedioNotas);
        return actividades;
    }

    @Transactional
    public double agregarNotaYCalcularNuevoPromedio(Integer actividadId, int nota) {
        // Las verificaciones del back están hechas en el controller
        if (nota < 1 || nota > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7.");
        }

        Actividad actividad = actividadRepository.findById(actividadId)
                .orElseThrow(() -> new IllegalArgumentException("Actividad no encontrada con ID: " + actividadId));

        Nota nuevaNota = new Nota();
        nuevaNota.setNota(nota);
        nuevaNota.setActividad(actividad);
        notaRepository.save(nuevaNota);

        // Volvemos a cargar la actividad para obtener la lista de notas actualizada
        Actividad actividadActualizada = actividadRepository.findById(actividadId).get();
        calcularPromedioNotas(actividadActualizada);

        return actividadActualizada.getPromedioNotas();
    }

    private void calcularPromedioNotas(Actividad actividad) {
        double promedio = actividad.getNotas().stream()
                .mapToInt(Nota::getNota)
                .average()
                .orElse(0.0); // Si no hay notas, el promedio es 0
        actividad.setPromedioNotas(promedio);
    }
}