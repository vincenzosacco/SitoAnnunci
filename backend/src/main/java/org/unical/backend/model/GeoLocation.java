package org.unical.backend.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class GeoLocation {
    private double lat;
    private double lng;
}
