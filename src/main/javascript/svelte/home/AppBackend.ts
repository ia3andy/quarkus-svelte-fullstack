import PersonService from "../person/PersonService";
import RestClient from "./RestClient";

export default class AppBackend{
    personService: PersonService;

    constructor(personService:PersonService){
        this.personService = personService;
    }

    public static async create(url:string){
        let restCLient = await RestClient.create(url)
        let personService = new PersonService(restCLient);
        return new AppBackend(personService);
    }

}