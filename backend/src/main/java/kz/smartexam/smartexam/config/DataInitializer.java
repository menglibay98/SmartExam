package kz.smartexam.smartexam.config;

import kz.smartexam.smartexam.model.Role;
import kz.smartexam.smartexam.model.User;
import kz.smartexam.smartexam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    public DataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (!userRepository.existsByEmail(adminEmail)) {

            User admin = new User();

            admin.setName("SmartExam");
            admin.setSurname("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(
                    passwordEncoder.encode(adminPassword)
            );
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("SmartExam admin created");
        }
    }
}