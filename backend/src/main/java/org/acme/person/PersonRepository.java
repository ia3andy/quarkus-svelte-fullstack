package org.acme.person;

import java.time.LocalDate;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

@Transactional
@ApplicationScoped
public class PersonRepository {
    public void add(Person p){
        var e = new PersonEntity();
        e.birth = LocalDate.now().minusYears(p.age);
        e.name = p.name;
        e.persist();
    }

    public List<Person> findAll(){
        var s = PersonEntity.findAll().list().stream().map(e -> mapPerson((PersonEntity)e));
        return s.toList();
    }

    public Person mapPerson(PersonEntity e){
        return new Person(e.name, LocalDate.now().getYear() -  e.birth.getYear());
    }
}
