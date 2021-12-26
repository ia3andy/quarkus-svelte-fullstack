<script lang="ts">
import AppBackend from "./app/AppBackend";

import Home from "./components/Home.svelte";


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