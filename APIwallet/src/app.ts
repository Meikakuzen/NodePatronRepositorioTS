import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import loadContainer  from './container'
import { loadControllers } from 'awilix-express'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env`
})



export const app: express.Application = express()

//debo cargar el container antes de usar los controladores
loadContainer(app)

//para usar los controladores
app.use(loadControllers(
    'controllers/*.ts', 
    {cwd: __dirname} //le indico en el objeto cual es la ruta donde debe empezar a buscar, es decirle /src
))

                   