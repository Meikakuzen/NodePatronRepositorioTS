import express from 'express'
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';
import { SubscriptionMySQLRepository } from './services/repositories/impl/mysql/subscription.repository';
import { SubscriptionService } from './services/subscription.service';
import { MovementMySQLRepository } from './services/repositories/impl/mysql/movement.repository';
import { MovementService } from './services/movement.service';
import { BalanceMySQLRepository } from './services/repositories/impl/mysql/balance.repository';


export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
    //aquí registro mis dependencias. Uso asClass para indicarle que es una clase. Uso .scoped() al final
    container.register({
        //repositories
        subscriptionRepository: asClass(SubscriptionMySQLRepository).scoped(),
        movementRepository: asClass(MovementMySQLRepository).scoped(),
        balanceRepository: asClass(BalanceMySQLRepository).scoped(),

        //services
        testService: asClass(TestService).scoped(),
        subscriptionService: asClass(SubscriptionService).scoped(),
        movementService: asClass(MovementService).scoped()

    })

    //Asocio el contenedor a express
    app.use(scopePerRequest(container))

}