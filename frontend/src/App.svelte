<script lang="ts">
import AppBackend from "./app/AppBackend";

import PersonService from "./app/person/PersonService";
import RestClient from "./app/RestClient";
import Home from "./components/Home.svelte";
import PersonView from "./components/PersonView.svelte";


	export let name: string;

	let appPromise = AppBackend.create("http://localhost:8080");
</script>

<main>
	<h1>Hello {name}!</h1>
	{#await appPromise}
		Loading...
	{:then app} 
		<Home app="{app}"></Home>
	{/await}
</main>

<style>

</style>