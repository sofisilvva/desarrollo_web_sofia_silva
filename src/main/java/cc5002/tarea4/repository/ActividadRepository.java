package cc5002.tarea4.repository;

import cc5002.tarea4.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    // Obtenemos las actividades que la fecha de término ya pasó
    @Query("SELECT a FROM Actividad a WHERE a.diaHoraTermino < :ahora ORDER BY a.diaHoraInicio DESC")
    List<Actividad> findActividadesRealizadas(LocalDateTime ahora);
}