package org.unical.backend.model;

import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Asta {
    private int id;
    private int annuncio_id;
    private BigDecimal prezzo_base;
    private BigDecimal prezzo_corrente;
    private Integer ultimo_offerente_id; //puo' essere null
    private String offerte;
    private Timestamp data_inizio;
    private Timestamp data_fine;
    private String stato;
}
