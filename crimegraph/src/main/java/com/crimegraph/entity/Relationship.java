package com.crimegraph.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "relationships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Relationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sourcePersonId;

    private Long targetPersonId;

    private String relationshipType;

    private String description;
}