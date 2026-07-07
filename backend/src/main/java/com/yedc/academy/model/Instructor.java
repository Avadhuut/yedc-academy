package com.yedc.academy.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "instructor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Instructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 255)
    private String experience;

    @Column(name = "profile_image", length = 255)
    private String profileImage;
}
