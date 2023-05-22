import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'


const container = createContainer()

//aquí registro mis dependencias. Uso asClass para indicarle que es una clase. Uso .scoped() al final
container.register({
    testService: asClass(TestService).scoped()
})

export{
    container
}