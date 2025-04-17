package org.unical.backend.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode // for testing purposes
public class Annuncio {
    private int id;
    private String title;
    private String description;
    private String price;
}
