package org.acme.person;

import java.time.LocalDate;

import javax.persistence.Entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity
public class PersonEntity extends PanacheEntity {
    public String name;
    public LocalDate birth;
}
