package cc5002.tarea4.controller;

import cc5002.tarea4.model.Actividad;
import cc5002.tarea4.service.ActividadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ActividadController {

    @Autowired
    private ActividadService actividadService;

    @GetMapping("/evaluar-actividades")
    public String mostrarPaginaEvaluacion(Model model) {
        List<Actividad> actividades = actividadService.getActividadesRealizadas();
        model.addAttribute("actividades", actividades);
        return "evaluar-actividades";
    }
}