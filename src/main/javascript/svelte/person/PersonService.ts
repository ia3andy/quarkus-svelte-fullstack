// @ts-ignore
import {Person} from "../generated/ts/model/person";
import {RestClient} from "../home/apputil.js";

export default class PersonService{

    restClient:RestClient;

    constructor(restClient:RestClient){
        this.restClient = restClient;
    }

    async loadPersons():Promise<Person[]>{
       return this.restClient.get("/persons");
    }
}