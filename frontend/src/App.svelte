<script lang="ts">
import PersonService from "./app/person/PersonService";
import PersonView from "./components/PersonView.svelte";


	export let name: string;

	let personService = new PersonService();
</script>

<main>
	<h1>Hello {name}!</h1>
	{#await personService.loadPersons()}
	  Loading...
	{:then persons}
	{#each persons as person}
	<PersonView person="{person}"></PersonView>
	{/each}
	{/await}
	
</main>

<style>

</style>