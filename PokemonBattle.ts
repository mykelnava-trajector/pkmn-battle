const express = require('express')

const app = express();

app.listen(3000, () => console.log(`Listening on port 3000.`))

interface PokemonStats{
    name: string;
    move: string;
    hp: number;
    dmg: number;
    image: string;
}

let Pokestats1 : PokemonStats[] = []

let Pokestats2 : PokemonStats[] = []

const yourPoke = async(YPokemonP: string) => {
        const PokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${YPokemonP}`)
        const PokeAPIJSON = await PokeAPI.json()
        const PokemonAPIImage = await fetch(PokeAPIJSON.sprites.front_default);
        const image = await PokemonAPIImage.arrayBuffer();
        const imageBase64 = Buffer.from(image).toString('base64');
        let PStats1: PokemonStats = {
            name: PokeAPIJSON.name,
            move: PokeAPIJSON.moves[0].move.name,
            hp: PokeAPIJSON.stats[0].base_stat,
            dmg: PokeAPIJSON.stats[1].base_stat,
            image: imageBase64
            }
        Pokestats1.push(PStats1)    
        }

const enemyPoke = async(EPokemonP: string) => {
    const EPokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${EPokemonP}`)
    const EPokeAPIJSON = await EPokeAPI.json()
    const EPokemonAPIImage = await fetch(EPokeAPIJSON.sprites.front_default);
    const Eimage = await EPokemonAPIImage.arrayBuffer();
    const EimageBase64 = Buffer.from(Eimage).toString('base64');
        let PStats2: PokemonStats = {
            name: EPokeAPIJSON.name,
            move: EPokeAPIJSON.moves[0].move.name,
            hp: EPokeAPIJSON.stats[0].base_stat,
            dmg: EPokeAPIJSON.stats[1].base_stat,
            image: EimageBase64
            }
        
        Pokestats2.push(PStats2)   
}

const clearPokemon = () => {
    Pokestats1.splice(0,Pokestats1.length)
    Pokestats2.splice(0,Pokestats2.length)
}

app.get(`/`, (req,res) =>{
    res.send(`<b>Pokemon Menu with Links</b>
        <p><b>Store Your Pokemon</b></p>
        <p><b>URL: http://localhost:3000/storeyourpokemon?ypokemon=(pokemonname)</b></p>
        <p><b>Store Enemy Pokemon</b></p>
        <p><b>URL: http://localhost:3000/storeenemypokemon?epokemon=(pokemonname)</b></p>
        <p><b>Pokemon Battle (Must choose both your Pokemon and enemy Pokemon before choosing this feauture)</b></p>
        <p><b>URL: http://localhost:3000/pokemonbattle</b></p>`)
})

app.get(`/storeyourpokemon`, async(req,res) =>{
    let ypokemon = req.query.ypokemon
    try {
        await yourPoke(ypokemon);
        res.send(`<b>Your Pokémon ${ypokemon} has been added to the battle.</b>`);
    } catch (error) {
        res.status(400).send(`Error: ${error.message}. Please try again.`);
    }
})

app.get(`/storeenemypokemon`, async(req,res) => {
    let epokemon = req.query.epokemon
    try{
        await enemyPoke(epokemon);
        res.send(`<b>Enemy Pokémon ${epokemon} has been added to the battle.</b>`);
    } catch (error) {
        res.status(400).send(`Error: ${error.message}. Please try again.`);
    }
})

app.get(`/pokemonbattle`, (req,res) => {
    if (Pokestats1.length === 0 || Pokestats2.length === 0) {
        res.status(400).send('Error: You must choose both your Pokémon and an enemy Pokémon before battling.')
    }
    let yourPokemonName = Pokestats1[0].name
    let yourPokemonMoveName = Pokestats1[0].move
    let yourPokemonHP = Pokestats1[0].hp
    let yourPokemonDMG = Pokestats1[0].dmg
    let yourPokemonImage = Pokestats1[0].image
    let enemyPokemonName = Pokestats2[0].name
    let enemyPokemonMoveName = Pokestats2[0].move
    let enemyPokemonHP = Pokestats2[0].hp
    let enemyPokemonDMG = Pokestats2[0].dmg
    let enemyPokemonImage = Pokestats2[0].image
        if(yourPokemonName && yourPokemonDMG && yourPokemonHP && yourPokemonMoveName
        && enemyPokemonName && enemyPokemonDMG && enemyPokemonHP && enemyPokemonMoveName){
            let yourPokemonHPDamaged = yourPokemonHP - enemyPokemonDMG
            let enemyPokemonHPDamaged = enemyPokemonHP - yourPokemonDMG
            if(yourPokemonHPDamaged > 0 && enemyPokemonHPDamaged <= 0 || yourPokemonHPDamaged > enemyPokemonHPDamaged){
                res.send(`<b>Your Pokemon Name: ${yourPokemonName}</b>
                    <p><b>Your Pokemon Move Name: ${yourPokemonMoveName}</b></p>
                    <p><b>Your Pokemon HP: ${yourPokemonHP}</b></p>
                    <p><b>Your Pokemon DMG: ${yourPokemonDMG}</b></p>
                    <p><b>Your Pokemon image: <img src="data:image/png;base64,${yourPokemonImage}"></b></p>
                    <p><b>================================================</b></p>
                    <p><b>Enemy Pokemon: ${enemyPokemonName}</b></p>
                    <p><b>Enemy Pokemon Move Name: ${enemyPokemonMoveName}</b></p>
                    <p><b>Enemy Pokemon HP: ${enemyPokemonHP}</b></p>
                    <p><b>Enemy Pokemon DMG: ${enemyPokemonDMG}</b></p>
                    <p><b>Enemy Pokemon image: <img src="data:image/png;base64,${enemyPokemonImage}"></b></p>
                    <p><b>================================================</b></p>
                    <p><b>Your pokemon won!</b></p>
                    <p><b>Head back to <a href="http://localhost:3000">http://localhost:3000</a></b></p>`)
                    clearPokemon()
                }
            else if(enemyPokemonHPDamaged > 0 && yourPokemonHPDamaged <= 0 || enemyPokemonHPDamaged > yourPokemonHPDamaged){
                res.send(`<b>Your Pokemon Name: ${yourPokemonName}</b>
                    <p><b>Your Pokemon Move Name: ${yourPokemonMoveName}</b></p>
                    <p><b>Your Pokemon HP: ${yourPokemonHP}</b></p>
                    <p><b>Your Pokemon DMG: ${yourPokemonDMG}</b></p>
                    <p><b>Your Pokemon image: <img src="data:image/png;base64,${yourPokemonImage}"></b></p>
                    <p><b>================================================</b></p>
                    <p><b>Enemy Pokemon: ${enemyPokemonName}</b></p>
                    <p><b>Enemy Pokemon Move Name: ${enemyPokemonMoveName}</b></p>
                    <p><b>Enemy Pokemon HP: ${enemyPokemonHP}</b></p>
                    <p><b>Enemy Pokemon DMG: ${enemyPokemonDMG}</b></p>
                    <p><b>Enemy Pokemon image: <img src="data:image/png;base64,${enemyPokemonImage}"></b></p>
                    <p><b>================================================</p>
                    <p><b>Enemy pokemon won!</b></p>
                    <p><b>Head back to <a href="http://localhost:3000">http://localhost:3000</a></p>`)
                    clearPokemon()
                }
            else if(yourPokemonHPDamaged <= 0 && enemyPokemonHPDamaged <= 0 || yourPokemonHPDamaged == enemyPokemonHPDamaged){
                res.send(`<b>Your Pokemon Name: ${yourPokemonName}</b>
                    <p><b>Your Pokemon Move Name: ${yourPokemonMoveName}</b></p>
                    <p><b>Your Pokemon HP: ${yourPokemonHP}</b></p>
                    <p><b>Your Pokemon DMG: ${yourPokemonDMG}</b></p>
                    <p><b>Your Pokemon image: <img src="data:image/png;base64,${yourPokemonImage}"></b></p>
                    <p><b>================================================</b></p>
                    <p><b>Enemy Pokemon: ${enemyPokemonName}}</b></p>
                    <p><b>Enemy Pokemon Move Name: ${enemyPokemonMoveName}}</b></p>
                    <p><b>Enemy Pokemon HP: ${enemyPokemonHP}}</b></p>
                    <p><b>Enemy Pokemon DMG: ${enemyPokemonDMG}}</b></p>
                     <p><b>Enemy Pokemon image: <img src="data:image/png;base64,${enemyPokemonImage}"></b></p>
                    <p><b>================================================}</b></p>
                    <p><b>It's a draw! No one won!}</b></p>
                    <p><b>Head back to <a href="http://localhost:3000">http://localhost:3000</a>}</b></p>`)
                    clearPokemon()
            }
    }
})