package org.unical.backend.model;

import lombok.*;

import java.sql.Timestamp;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Messaggio {
    private int id;
    /** foreign key to the user table */
    private int senderId;
    /** foreign key to the user table */
    private int addresseeId;

    private String text;
    private Timestamp date;
    private int conversationId;
}
