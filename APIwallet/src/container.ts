import express from 'express'
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';


export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
    //aquí registro mis dependencias. Uso asClass para indicarle que es una clase. Uso .scoped() al final
    container.register({
        testService: asClass(TestService).scoped()
    })

    //Asocio el contenedor a express
    app.use(scopePerRequest(container))

}