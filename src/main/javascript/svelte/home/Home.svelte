<script lang="ts">
import App from "../App.svelte";
import AppBackend from "./AppBackend";

    import PersonView from "../person/PersonView.svelte";
    
        export let app:AppBackend;
    </script>
    
	{#await app.personService.loadPersons()}
	  Loading...
	{:then persons}
	{#each persons as person}
	    <PersonView person="{person}"></PersonView>
	{/each}
	{/await}