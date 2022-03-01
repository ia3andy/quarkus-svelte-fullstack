<script lang="ts">
import AppBackend from "./home/AppBackend";

import Home from "./home/Home.svelte";


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