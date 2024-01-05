package com.example.controledechaves.controller;

import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class LoginController {
    SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();


    @GetMapping("/login")
    public String loadLoginForm(){
        return "login";
    }

    @GetMapping("cadastro-de-salas")
    public String loadSalaPage(){
        return "page/cadastro-de-chaves";
    }

    @GetMapping("/logout")
    public String performLogout(org.springframework.security.core.Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        this.logoutHandler.logout(request, response, authentication);
        return "redirect:/";
    }
}
