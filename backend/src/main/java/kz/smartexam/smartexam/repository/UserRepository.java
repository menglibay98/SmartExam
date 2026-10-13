package kz.smartexam.smartexam.repository;

import kz.smartexam.smartexam.model.Role;
import kz.smartexam.smartexam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);
}
