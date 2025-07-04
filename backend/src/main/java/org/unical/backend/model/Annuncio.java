package org.unical.backend.model;

import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode // for testing purposes (but not only)
public class Annuncio {
    private int id; // must be set only by db
    private String titolo;
    private String descrizione;
    private BigDecimal prezzo;
    private BigDecimal prezzo_asta;
    private int superficie;
    private String indirizzo;
    private Double latitudine;
    private Double longitudine;
    private boolean in_vendita;
    /** foreign key to the category table */
    private int categoria_id;
    /** foreign key to the user table */
    private int venditore_id;
    private Timestamp data_creazione;
    private String foto;
    private boolean promozione;


//    public Annuncio(int id, @NotNull String title, @NotNull String description, @NotNull String price) {
//        this.setId(id);
//        this.setTitle(title);
//        this.setDescription(description);
//        this.setPrice(price);
//    }
//
//    public void setPrice(@NotNull BigDecimal price) {
//        if (price.compareTo(BigDecimal.ZERO) < 0) {
//            throw new IllegalArgumentException("Price cannot be negative");
//        }
//        this.price = price;
//    }
//
//    public void setPrice(@NotNull String price) {
//        this.setPrice(new BigDecimal(price));
//    }

}
