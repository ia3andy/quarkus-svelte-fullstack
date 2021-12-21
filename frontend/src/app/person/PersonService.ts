import {Person} from "../generated/api/model/person";

export default class PersonService{

    public async loadPerson():Promise<Person>{
        let res = await fetch("http://localhost:8080/person");
        let person:Person = await res.json();
        return person;
    }
}