package kz.smartexam.smartexam.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TeacherResponse {

    private Long id;
    private String name;
    private String surname;
    private String email;
}
