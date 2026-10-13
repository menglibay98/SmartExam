package kz.smartexam.smartexam.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kz.smartexam.smartexam.model.User;
import kz.smartexam.smartexam.repository.UserRepository;
import kz.smartexam.smartexam.service.JWTService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter  extends OncePerRequestFilter {

    private final JWTService service;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JWTService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }

        String token = authHeader.substring(7);

        if (!service.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = service.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            "ROLE_" + user.getRole().name()
                    );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            List.of(authority)
                    );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
