const Surfboard   = require('../models/surfboard'),
      fetch       = require('node-fetch');

/* Figures the minimum weight limit of the surfboard according to the user's weight and surfing level */
function getRange(weight, level){

    let min = 35;
    let max = 45;

    if(weight < min){
        return 35;
    }

    if(weight > 105){
        return 96;
    }

    for(let i = 0; i < 7; ++i){
        if(weight >= min && weight <= max){
            if(level >= 4 && level < 6){
                if(min <= 46)
                    return 35;
                
                return min - 10;
            }

            if(level >=6 && level < 8){
                if(min <= 56)
                    return 35;

                return min - 20;
            }
            
            if(level >= 8 && level <= 10){
                if(min <= 66)
                    return 35;

                return min - 30;
            }

            return min;
        }

        if(min === 35){
            min = 46;
            max = 55;
            continue;
        }

        min += 10;
        max += 10;
    }
}

/* Connects to the external weather API to get wave height in the chosen location */
async function getWeather (location){
    let result;
    let url = 'http://magicseaweed.com/api/fddcb4d4dfe5f4d98e9ba4c0351d9614/forecast/?spot_id=' + location;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store'
        });
        result = await response.json();
    } 
    catch (error) {
        console.log("hello1");
        console.log(error);
    }

    if(result.error_response){
        console.log("hello");
        return -1;
    }
    
    return(result[result.length-1].swell.minBreakingHeight);
    
}

module.exports = {
    getWeather: async (location) => {
        const result = await getWeather(location);
        console.log(result);
        return result;
    },

    /* Gets all surfboards */
    getAll: async (req, res) => {
        Surfboard.find({}).then(result => {
            if(result)
                res.send(JSON.stringify(result));
            else res.status(404).send(`{"Failure": "No Documents Were Found"}`);
        }, err =>{
            res.status(404).send(`{"Failure": "No Documents Were Found"}`);
        });
    },

    /* Gets matching surfboards according to the user's weight, surfing level and wave height in chosen location */
    getMatched: async (req, res) => {
        let minWeight = getRange(parseFloat(req.query.weight), parseInt(req.query.level));
        let swellSize =  await getWeather(req.query.location);
        
        if(swellSize > 4){
            swellSize = 4;
        }

        const conditions = {height: {'$gt': parseFloat(req.query.height)}, userMinWeight: minWeight, maxSwell: {'$gt': swellSize}};

        if(swellSize < 0){
            res.status(404).send(`{"result": "Failure", "params":{"conditions": ${JSON.stringify(conditions)}, "location": "${req.query.location}"}, "error": "No Match Found"}`);
            return;
        }

        Surfboard.find(conditions).then(result => {
            if(result.length)
                res.send(JSON.stringify(result));
            else res.status(404).send(`{"result": "Failure", "params":{"conditions": ${JSON.stringify(conditions)}}, "error": "No Match Found"}`);
        }, err => {
            res.status(404).send(`{"result": "Failure", "params":{"conditions": ${JSON.stringify(conditions)}}, "error": ${JSON.stringify(err)} }`);
        });
    },

    /* For now, updates a surfboards Brand */
    updateSurfboard: async (req,res) => {
        const {brand = null} = req.query;
        const opts = {runValidators: true};

        Surfboard.updateOne({_id: req.query.id}, {brand: brand}, opts)
        .then(result =>{
                if(result && result.nModified > 0)
                    res.status(200).send(`{"result": "Success", "params": {"id": "${req.query.id}", "brand": "${brand}"}}`);
                else res.status(404).send(`{"result": "Failure", "params": {"id": "${req.query.id}", "brand": "${brand}"}}`)
            }, err => {
                res.status(404).send(`{"result": "Failure", "params":{"id": "${req.query.id}", "brand": "${brand}"}, "error": ${JSON.stringify(err)}}`);
        });
    },

    /* Removes a surfboard */
    deleteSurfboard: async (req,res) => {
        Surfboard.findOneAndDelete({_id: req.query.id}).then(result => {
            if(result)
                res.send(`{"result": "Success", "params": {"id": "${req.query.id}"}}`);
            else res.send(`{"result": "Failure", "params": {"id": "${req.query.id}"}}`);
        }, err => {
            res.send(`{"result": "Failure", "params": {"id": "${req.query.id}", "brand": "${req.query.brand}"}, "error": ${JSON.stringify(err)}}`);
        })
        
    },

    /* Adds a surfboard */
    addSurfboard: async (req,res) => {
        const {brand = null, maxSwell = null, height = null, width = null, thickness = null, userMinWeight = null, userMaxWeight = null} = req.body,
               minWeight = getRange(userMinWeight, 0);
        var maxWeight;

        if(minWeight == 35){
            maxWeight = 45;
        }
        else maxWeight = minWeight + 9;
        
        const surfboard  = new Surfboard({brand, maxSwell, height, width, thickness, userMinWeight: minWeight, userMaxWeight: maxWeight});

        surfboard.save()
        .then(result => {
            if(result)
                res.status(200).send(`{"result": "Success", "params": ${JSON.stringify(result)}}`);
            else res.status(404).send(`{"result": "Failure", "params":${JSON.stringify(result)}}`);
        }, err => {
            res.status(404).send(`{"result": "Failure", "params": ${JSON.stringify(surfboard)}, "error": ${JSON.stringify(err)}}`);
        });
    }
}