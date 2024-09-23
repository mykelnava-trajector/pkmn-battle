const express = require('express')

const app = express();

app.listen(3000, () => console.log(`Listening on port 3000.`))

interface PokemonStats{
    name: string;
    move: string;
    hp: number;
    dmg: number;
}

let Pokestats1 : PokemonStats[] = []

let Pokestats2 : PokemonStats[] = []

const yourPoke = async(YPokemonP: string) => {
        const PokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${YPokemonP}`)
        const PokeAPIJSON = await PokeAPI.json()
        let PStats1: PokemonStats = {
            name: PokeAPIJSON.name,
            move: PokeAPIJSON.moves[0].move.name,
            hp: PokeAPIJSON.stats[0].base_stat,
            dmg: PokeAPIJSON.stats[1].base_stat
            }
        Pokestats1.push(PStats1)    
        }

const enemyPoke = async(EPokemonP: string) => {
    const EPokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${EPokemonP}`)
        const EPokeAPIJSON = await EPokeAPI.json()
        let PStats2: PokemonStats = {
            name: EPokeAPIJSON.name,
            move: EPokeAPIJSON.moves[0].move.name,
            hp: EPokeAPIJSON.stats[0].base_stat,
            dmg: EPokeAPIJSON.stats[1].base_stat
            }
        Pokestats2.push(PStats2)   
}

const clearPokemon = () => {
    Pokestats1.splice(0,Pokestats1.length)
    Pokestats2.splice(0,Pokestats2.length)
}

app.get(`/`, (req,res) =>{
    res.send(`Store Your Pokemon
        <p>URL: http://localhost:3000/storeyourpokemon?ypokemon=(pokemonname)</p>
        <p>Store Enemy Pokemon</p>
        <p>URL: http://localhost:3000/storeenemypokemon?epokemon=(pokemonname)</p>
        <p>Pokemon Battle (Must choose both your Pokemon and enemy Pokemon before choosing this feauture)</p>
        <p>http://localhost:3000/pokemonbattle</p>`)
})

app.get(`/storeyourpokemon`, async(req,res) =>{
    let ypokemon = req.query.ypokemon
    yourPoke(ypokemon)
    if(ypokemon){
        res.send(`Your pokemon ${ypokemon} has been added to the battle.`)
    }
    else{
        res.send(`Error. Pick again.`)
        yourPoke(ypokemon)
    }
})

app.get(`/storeenemypokemon`, async(req,res) => {
    let epokemon = req.query.epokemon
    enemyPoke(epokemon)
    if(epokemon){
        res.send(`Enemy pokemon ${epokemon} has been added to the battle.`)
    }
    else{
        res.send(`Error. Pick again.`)
        enemyPoke(epokemon)
    }
})

app.get(`/pokemonbattle`, (req,res) => {
    let yourPokemonName = Pokestats1[0].name
    let yourPokemonMoveName = Pokestats1[0].move
    let yourPokemonHP = Pokestats1[0].hp
    let yourPokemonDMG = Pokestats1[0].dmg
    let enemyPokemonName = Pokestats2[0].name
    let enemyPokemonMoveName = Pokestats2[0].move
    let enemyPokemonHP = Pokestats2[0].hp
    let enemyPokemonDMG = Pokestats2[0].dmg
        if (!Pokestats1.length || !Pokestats2.length) {
        return res.send(`Choose pokemons before going to this endpoint.`);
            }
        if(yourPokemonName && yourPokemonDMG && yourPokemonHP && yourPokemonMoveName
        && enemyPokemonName && enemyPokemonDMG && enemyPokemonHP && enemyPokemonMoveName){
            let yourPokemonHPDamaged = yourPokemonHP - enemyPokemonDMG
            let enemyPokemonHPDamaged = enemyPokemonHP - yourPokemonDMG
            if(yourPokemonHPDamaged > 0 && enemyPokemonHPDamaged <= 0 || yourPokemonHPDamaged > enemyPokemonHPDamaged){
                res.send(`Your Pokemon Name: ${yourPokemonName}
                    <p>Your Pokemon Move Name: ${yourPokemonMoveName}</p>
                    <p>Your Pokemon HP: ${yourPokemonHP}</p>
                    <p>Your Pokemon DMG: ${yourPokemonDMG}
                    <p>================================================</p>
                    <p>Enemy Pokemon: ${enemyPokemonName}</p>
                    <p>Enemy Pokemon Move Name: ${enemyPokemonMoveName}</p>
                    <p>Enemy Pokemon HP: ${enemyPokemonHP}</p>
                    <p>Enemy Pokemon DMG: ${enemyPokemonDMG}</p>
                    <p>================================================</p>
                    <p> Your pokemon won! </p>
                    <p> Head back to <a href="http://localhost:3000">http://localhost:3000</a></p>`)
                    clearPokemon()
                }
            else if(enemyPokemonHPDamaged > 0 && yourPokemonHPDamaged <= 0 || enemyPokemonHPDamaged > yourPokemonHPDamaged){
                res.send(`Your Pokemon Name: ${yourPokemonName}
                    <p>Your Pokemon Move Name: ${yourPokemonMoveName}</p>
                    <p>Your Pokemon HP: ${yourPokemonHP}</p>
                    <p>Your Pokemon DMG: ${yourPokemonDMG}
                    <p>================================================</p>
                    <p>Enemy Pokemon: ${enemyPokemonName}</p>
                    <p>Enemy Pokemon Move Name: ${enemyPokemonMoveName}</p>
                    <p>Enemy Pokemon HP: ${enemyPokemonHP}</p>
                    <p>Enemy Pokemon DMG: ${enemyPokemonDMG}</p>
                    <p>================================================</p>
                    <p> Enemy pokemon won! </p>
                    <p> Head back to <a href="http://localhost:3000">http://localhost:3000</a></p>`)
                    clearPokemon()
                }
            else if(yourPokemonHPDamaged <= 0 && enemyPokemonHPDamaged <= 0 || yourPokemonHPDamaged == enemyPokemonHPDamaged){
                res.send(`Your Pokemon Name: ${yourPokemonName}
                    <p>Your Pokemon Move Name: ${yourPokemonMoveName}</p>
                    <p>Your Pokemon HP: ${yourPokemonHP}</p>
                    <p>Your Pokemon DMG: ${yourPokemonDMG}
                    <p>================================================</p>
                    <p>Enemy Pokemon: ${enemyPokemonName}</p>
                    <p>Enemy Pokemon Move Name: ${enemyPokemonMoveName}</p>
                    <p>Enemy Pokemon HP: ${enemyPokemonHP}</p>
                    <p>Enemy Pokemon DMG: ${enemyPokemonDMG}</p>
                    <p>================================================</p>
                    <p> It's a draw! No one won! </p>
                    <p>Head back to <a href="http://localhost:3000">http://localhost:3000</a></p>`)
                    clearPokemon()
            }
    }
})