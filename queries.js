const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'assignment2',
    password: 'yashvi',
    port: 5432,
})

//to get all cars
const getCars = (request, response) => {
    pool.query('select  car .id as "Car Id",car."Name" as "Car Name",make."Name" as "Make Name",model."name" as "Model Name" from car join make  on car.makeid =make.id join model on car.modelid  = model.id', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows)
    })
}


//to get a car by its id 
const getCarById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('select  car .id as "Car Id",car."Name" as "Car Name",make."Name" as "Make Name",model."name" as "Model Name" from car  join make  on make.id =car.makeid  join model on model .id  = car.modelid  where  car.id =$1', [id], (error, results) => {
        if (error) {

            throw error;
        }
        response.status(200).json(results.rows)
    })
}

module.exports = {
    getCars,
    getCarById
}