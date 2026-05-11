package com.bolsaempleo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    
    @GetMapping("/")
    public String home() {
        // Redirige al archivo ladingpage.html que está en la raíz del proyecto
        return "redirect:/ladingpage.html";
    }
}