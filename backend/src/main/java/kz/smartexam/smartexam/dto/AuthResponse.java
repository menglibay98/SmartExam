package kz.smartexam.smartexam.dto;


import kz.smartexam.smartexam.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String name;
    private String surname;
    private String email;
    private Role role;
    private String token;
}
