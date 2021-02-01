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
    pool.query('select  car .id as "Car Id",car.name as "Car Name",make.name as "Make Name",model.name as "Model Name" from car join make  on car.makeid =make.id join model on car.modelid  = model.id order by car.id asc', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

//to get a car by it's id 
const getCarById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('select  car .id as "Car Id",car.name as "Car Name",make.name as "Make Name",model.name as "Model Name" from car  join make  on make.id =car.makeid  join model on model .id  = car.modelid  where  car.id =$1', [id], (error, results) => {
        if (error) {

            throw error;
        }
        response.status(200).json(results.rows)
    })
}

//to add car
const addCar = async(request, response) => {

    let carname = String(request.body.carname)
    let makername = String(request.body.makername)
    let modelname = String(request.body.modelname)
    console.log('carname', carname)
    console.log('makername', makername)
    console.log('modelname', modelname)

    let newModelId
    let newMakeId

    //to check if a car exists or not
    const findCar = await pool.query('select id from car where name=$1', [carname])
    if (findCar.rowCount > 0) {
        response.json('car already exists')
    } else {
        // to check if a maker exists or not
        const findMaker = await pool.query('select * from make where name=$1 ', [makername])
        if (findMaker.rowCount > 0) {
            newMakeId = findMaker.rows[0].id
            console.log(newMakeId)
        } else {

            // to insert a new maker
            const insertMaker = await pool.query('insert into make (name) values ($1)', [makername])
            newMakeId = insertMaker.rows[0].id
            console.log(insertMaker.rows[0].id)
        }

        //to check if a model exists or not 
        const findModel = await pool.query('select * from  model where name=$1', [modelname])
        if (findModel.rowCount > 0) {
            newModelId = findModel.rows[0].id
            console.log(newModelId)
        } else {
            // to insert a new model
            const insertModel = await pool.query('insert into model (name) values ($1)', [modelname])
            newModelId = insertModel.rows[0].id
            console.log(insertModel.rows[0].id)
        }

        // to insert a new car 
        pool.query('insert into car (name,makeid,modelid) values ($1,$2,$3)', [carname, newMakeId, newModelId], (err, results) => {
            if (err) {
                console.log(err)
            }
            response.json('car added successfully')
        })
    }
}

//to update car
const updateCar = async(request, response) => {
    const id = parseInt(request.params.id)
    console.log(id)
    let carname = String(request.body.carname)
    console.log(carname)
    let makername = String(request.body.makername)
    console.log(makername)
    let modelname = String(request.body.modelname)
    console.log(modelname)

    let modelid
    let makeid

    //to check if  car exists or not
    const carExists = await pool.query('select * from car where name=$1', [carname])
    if (carExists.rowCount > 0) {
        response.json('car exists')
    } else {
        //to check if a maker exists or not
        const makeExist = await pool.query('select id from make where name=$1', [makername])
        if (makeExist.rowCount > 0) {
            makeid = makeExist.rows[0].id
            console.log(makeid)
        } else {
            // if a maker doesnt exists new maker is added
            const newMaker = await pool.query('insert into make (name) values ($1)', [makername])
            makeid = newMaker.rows[0].id
            console.log(makeid)
        }

        //to check whether  a model exists or not
        const modelExist = await pool.query('select id from model where name=$1', [modelname])
        if (modelExist.rowCount > 0) {
            modelid = modelExist.rows[0].id
            console.log(modelid)
        } else {
            // if a model doesnt exist  new model is added 
            const newModel = await pool.query('insert into model (name) values($1)', [modelname])
            modelid = newModel.rows[0].id
            console.log(modelid)

        }

        pool.query('update car set name=$1 where id=$2', [carname, id]) // to update car name
        pool.query('update car set modelid=$1 where id=$2', [modelid, id]) // to update modelid
        pool.query('update car set makeid=$1 where id=$2', [makeid, id]) // to update make id
        response.json('car updated successfully')

    }
}

//to delete car
const deleteCar = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('delete from car where id=$1', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            response.json('car deleted successfully')
        }
    })
}

//to add image of car
const addCarImage = (request, response, next) => {
    const id = parseInt(request.params.id)


    var date = Date.now()
    console.log(date)
    var createddate = new Date().toDateString()
    console.log(createddate)
    const imagename = String(request.file.filename)
    console.log(imagename)
    const imagepath = String('http://localhost:3000/uploads/images/' + request.file.filename)
    if (!request.file) {
        response.status(500)
        return next(err)
    }
    pool.query('insert into carimage (carid,imagename,createddate,imagepath) values($1,$2,$3,$4)', [id, imagename, createddate, imagepath])
    response.json({ fileUrl: 'http://localhost:3000/uploads/images/' + request.file.filename });
}

//to get car with image
const carWithImage = (request, response) => {
    pool.query('select c.id as "Car Id",c.name as "Car Name",m.name as "Maker Name",mo.name as "Model Name",ci.imagename  as "Image Name",ci.imagepath as "Image Path"from  car c join make m on c.makeid =m.id join model mo on c.modelid =mo.id left join carimage ci on c.id = ci.carid order by c.id  asc ', (error, results) => {
        if (error) {
            console.log(error)
        }
        console.log(results.rows)
        response.status(200).json(results.rows)
    })
}
module.exports = {
    getCars,
    getCarById,
    deleteCar,
    addCar,
    updateCar,
    addCarImage,
    carWithImage
}