package org.acme.person;


import java.time.LocalDate;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;


@Path("/persons")
public class PersonResource {

    @Inject
    PersonRepository personRepository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Person> hello() {
        var person = new Person("max", 12);
        personRepository.add(person);
        return personRepository.findAll();
    }
}