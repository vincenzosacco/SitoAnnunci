package org.unical.backend.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Foto {
    private int id;
    private int annuncio_id;
    private byte[] dati;
}
