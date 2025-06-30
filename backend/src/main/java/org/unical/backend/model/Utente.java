package org.unical.backend.model;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Utente {
    private Integer id;
    private String nome;
    private String cellulare;
    private String email;
    private String password;
    /** foreign key to the role table */
    private Integer ruolo_id;
    private boolean bannato;
}
