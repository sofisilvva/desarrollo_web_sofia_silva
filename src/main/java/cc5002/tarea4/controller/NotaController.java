package cc5002.tarea4.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import cc5002.tarea4.service.ActividadService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class NotaController {

    @Autowired
    private ActividadService actividadService;

    @PostMapping("/actividades/{id}/evaluar")
    public ResponseEntity<?> evaluarActividad(@PathVariable("id") Integer id,
            @RequestBody Map<String, String> payload) {
        try {
            String notaStr = payload.get("nota");
            int notaValidada = validarYConvertirNota(notaStr);
            double nuevoPromedio = actividadService.agregarNotaYCalcularNuevoPromedio(id, notaValidada);

            return ResponseEntity.ok(Map.of("nuevoPromedio", nuevoPromedio));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Ocurrió un error inesperado."));
        }
    }

    private int validarYConvertirNota(String notaStr) {
        if (notaStr == null || notaStr.trim().isEmpty()) {
            throw new IllegalArgumentException("La nota no puede estar vacía.");
        }
        String notaEstandarizada = notaStr.trim().replace(',', '.');
        double notaNum;
        try {
            notaNum = Double.parseDouble(notaEstandarizada);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("La nota debe ser un número válido.");
        }
        if (notaNum % 1 != 0) {
            throw new IllegalArgumentException("La nota debe ser un número entero.");
        }
        if (notaNum < 1 || notaNum > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7.");
        }
        return (int) notaNum;
    }
}