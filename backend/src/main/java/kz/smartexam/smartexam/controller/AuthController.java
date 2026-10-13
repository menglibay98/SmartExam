package kz.smartexam.smartexam.controller;


import jakarta.validation.Valid;
import kz.smartexam.smartexam.dto.AuthResponse;
import kz.smartexam.smartexam.dto.LoginRequest;
import kz.smartexam.smartexam.dto.RegisterRequest;
import kz.smartexam.smartexam.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
