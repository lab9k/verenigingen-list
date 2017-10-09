<template>
    <div id="nieuw">
        <h2>{{ msg }}</h2>

        <form onsubmit="return false" action="" class="add-vereniging-form">
            <label for="new-vereniging-naam">Naam</label>
            <input type="text" id="new-vereniging-naam">

            <label for="new-vereniging-beschrijving">Beschrijving</label>
            <input type="text" id="new-vereniging-beschrijving">

            <label for="new-vereniging-ondernemingsnummer">Ondernemingsnummer</label>
            <input type="text" id="new-vereniging-ondernemingsnummer">

            <button id="addVerenigingBtn" v-on:click="addVereniging">Voeg Toe!</button>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'nieuw',
        data() {
            return {
                msg: 'Voeg nieuwe vereniging toe'
            }
        },
        methods: {
            addVereniging: function() {
                let naam = document.getElementById("new-vereniging-naam").value;
                let ondernemingsnummer = document.getElementById("new-vereniging-ondernemingsnummer").value;
                let beschrijving = document.getElementById("new-vereniging-beschrijving").value;
                this.$root.addVereniging(naam, ondernemingsnummer, beschrijving)
            }
        }
    }
</script>
