package com.example.controledechaves.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new com.example.controledechaves.service.UsuarioDetailsServiceImpl();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable).authorizeHttpRequests(
                (authorize) -> authorize
                        .requestMatchers("/js/**", "/css/**").permitAll()
                        .requestMatchers("/usuarios/cadastro").permitAll()
                        .requestMatchers("/usuarios/salvar").permitAll()
                        .anyRequest().authenticated())
                .formLogin(
                        form -> form
                                .loginPage("/login")
                                .loginProcessingUrl("/login")
                                .defaultSuccessUrl("/page/cadastro-de-chaves")
                                .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout") // URL para deslogar
                        .logoutSuccessUrl("/login") // URL de redirecionamento após o logout
                        .invalidateHttpSession(true) // Invalida a sessão HTTP existente
                        .deleteCookies("JSESSIONID") // Remove cookies específicos ao deslogar
                );
        return http.build();
    }
}