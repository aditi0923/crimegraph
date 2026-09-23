package com.crimegraph.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String caseNumber;

    private String title;

    private String description;

    private String status;
}