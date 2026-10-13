package kz.smartexam.smartexam.service;

import kz.smartexam.smartexam.dto.AuthResponse;
import kz.smartexam.smartexam.dto.LoginRequest;
import kz.smartexam.smartexam.dto.RegisterRequest;

import kz.smartexam.smartexam.model.Role;
import kz.smartexam.smartexam.model.User;

import kz.smartexam.smartexam.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;


    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JWTService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // =========================
    // REGISTER
    // =========================

    public AuthResponse register(
            RegisterRequest request
    ) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Email already exists"
            );
        }


        // Create new user
        User user = new User();

        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setEmail(request.getEmail());

        // Encode password
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        // Public registration always creates STUDENT
        user.setRole(Role.STUDENT);


        // Save user
        User savedUser =
                userRepository.save(user);


        // Generate JWT and return response
        return convertToResponse(savedUser);
    }


    // =========================
    // LOGIN
    // =========================

    public AuthResponse login(
            LoginRequest request
    ) {

        // Find user by email
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );


        // Check password
        boolean passwordCorrect =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );


        if (!passwordCorrect) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        // Generate JWT and return user data
        return convertToResponse(user);
    }


    // =========================
    // CONVERT USER TO RESPONSE
    // =========================

    private AuthResponse convertToResponse(
            User user
    ) {

        // Generate JWT token
        String token =
                jwtService.generateToken(user);


        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }
}