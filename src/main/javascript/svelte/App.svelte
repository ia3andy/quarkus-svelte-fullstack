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
	<br>
	<a href="http://localhost:8080/q/dev">Dev UI</a><br>
	<a href="http://localhost:8080/q/swagger-ui">Swagger Ui</a><br>
	<a href="http://localhost:8080/h2">H2 Console</a> (jdbc:h2:file:./target/database)<br>
</main>

<style>
main {
    font-size: 20px;
}
</style>