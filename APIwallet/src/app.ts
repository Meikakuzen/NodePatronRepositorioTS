import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { container } from './container'
import { TestService } from './services/test.service'


process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env`
})



export const app: express.Application = express()

app.get('/', (req,res)=>{
    res.send("Running...")
})

                    //Le digo de que tipo es la propiedad y le paso el nombre de la propiedad del container
const testService = container.resolve<TestService>('testService')

//Pruebo que me devuelva la fecha
console.log(testService.get())