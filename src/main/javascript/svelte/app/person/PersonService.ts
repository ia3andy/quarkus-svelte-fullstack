// @ts-ignore
import {Person} from "../generated/api/model/person";
import RestClient from "../RestClient";

export default class PersonService{

    restClient:RestClient;

    constructor(restClient:RestClient){
        this.restClient = restClient;
    }

    async loadPersons():Promise<Person[]>{
       return this.restClient.getList("/persons");
    }
}