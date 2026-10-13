
package kz.smartexam.smartexam.config;

import kz.smartexam.smartexam.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(
                        corsConfigurationSource()
                ))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .authorizeHttpRequests(auth -> auth

                        // PUBLIC
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // ADMIN
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        // STUDENT + TEACHER
                        // READ QUIZZES
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/quizzes",
                                "/api/quizzes/*",
                                "/api/quizzes/*/questions"
                        )
                        .hasAnyRole("TEACHER", "STUDENT")

                        // STUDENT
                        // MY RESULTS
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/results/my"
                        )
                        .hasRole("STUDENT")

                        // STUDENT
                        // START QUIZ
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/quizzes/*/start"
                        )
                        .hasRole("STUDENT")

                        // STUDENT
                        // SUBMIT QUIZ
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/quizzes/*/submit"
                        )
                        .hasRole("STUDENT")

                        // STUDENT
                        // SAVE ANSWER
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/quizzes/*/answers"
                        )
                        .hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/quizzes/*/answers")
                        .hasRole("STUDENT")

                        // TEACHER
                        // CREATE QUIZ
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/quizzes"
                        )
                        .hasRole("TEACHER")

                        // TEACHER
                        // ADD QUESTIONS
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/quizzes/*/questions"
                        )
                        .hasRole("TEACHER")

                        // TEACHER
                        // DELETE QUIZZES
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/quizzes/**"
                        )
                        .hasRole("TEACHER")

                        // TEACHER
                        // DELETE QUESTIONS
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/questions/**"
                        )
                        .hasRole("TEACHER")

                        // TEACHER
                        // RESULTS
                        .requestMatchers("/api/results/**")
                        .hasRole("TEACHER")

                        // TEACHER
                        // DASHBOARD
                        .requestMatchers("/api/dashboard/teacher")
                        .hasRole("TEACHER")

                        // EVERYTHING ELSE
                        .anyRequest()
                        .denyAll()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("Authorization", "Content-Type")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
