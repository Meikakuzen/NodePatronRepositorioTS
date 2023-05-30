import express from 'express'
import dotenv from 'dotenv'
import loadContainer  from './container'
import { loadControllers } from 'awilix-express'
import path from 'path'
/*import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
*/


process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env`
})




export const app: express.Application = express()

//Habilito a express leer JSON
app.use(express.json())

//debo cargar el container antes de usar los controladores
loadContainer(app)

//para usar los controladores
app.use(loadControllers(
    'controllers/*.ts', 
    {cwd: __dirname} //le indico en el objeto cual es la ruta donde debe empezar a buscar, es decirle /src
))

                   