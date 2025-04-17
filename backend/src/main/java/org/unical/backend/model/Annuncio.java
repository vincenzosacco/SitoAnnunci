package org.unical.backend.model;

import lombok.*;
import org.jetbrains.annotations.NotNull;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode // for testing purposes (but not only)
public class Annuncio {
    private int id; // must be set only by db
    private String title;
    private String description;
    private BigDecimal price;


    public Annuncio(int id, @NotNull String title, @NotNull String description, @NotNull String price) {
        this.setId(id);
        this.setTitle(title);
        this.setDescription(description);
        this.setPrice(price);
    }

    public void setPrice(@NotNull BigDecimal price) {
        if (price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.price = price;
    }

    public void setPrice(@NotNull String price) {
        this.setPrice(new BigDecimal(price));
    }

}
