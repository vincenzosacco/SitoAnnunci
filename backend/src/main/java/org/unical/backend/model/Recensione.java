package org.unical.backend.model;


import lombok.*;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Recensione {
    private int id;
    private int annuncio_id;
    private int autore_id;
    private String nome_autore;
    private String testo;
    private int voto;
    private Timestamp data;
}
