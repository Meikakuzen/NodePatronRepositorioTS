# NODE Patrón repositorio MySQL

- MySQL instalado
- Usaré MySQL Workbench
- Creo la base de datos KodotiWallet
- Instalo con npm i mysql2 y los tipos con types/mysql
- Creo una carpeta en src/common/ llamada persistence con mysql.persistence.ts
- Me puedo conectar con createConnection y createPool, la segunda es un poco más interesante
  - Si una instancia ya está liberada para la conexión te la brinda
  - createConnection se comportaría como un Singleton
- Trabajaremos con createPool
- Lo importo de mysql2/promise para poder hacer uso de las promesas
  - Sin esto tendríamos que usar un callback en el query para que nos responda esa petición asíncrona

~~~js
//sin promesas
query(()=>{

})

//más limpio usar await query()
~~~

- Uso decimalNumbers: true para trabajar con números en los objetos y no con cadenas (20 en lugar de "20")
- mysql.persistence.ts

~~~js
import {createPool} from 'mysql2/promise'



export default createPool({
    host: process.env.db_mysql_host,
    user: process.env.db_mysql_user,
    password: process.env.db_mysql_password,
    database: process.env.db_mysql_database,
    decimalNumbers: true //habilita que retorne los numeros en los objetos como números y no como strings
})

//todos estos valores hay que setearlos en el archivo .env de development.env

/*
db_mysql_host=localhost
db_mysql_user=root
db_mysql_password=root
db_mysql_database=kodotiwallet
*/
~~~
-----

## Repositorio - métodos de lectura

- Creo la carpeta domain en src/services/repositories/
- También la carpeta impl (de implementación) dentro de /repositories
- Vamos a empezar a cear nuestra clase de dominio
- Creo en /domain/subscription.ts
- No lo voy a trabajar como una clase sino como una interfaz
    - Va a contener los campos que tiene mi tabla (creo la tabla con estos campos en Workbench)
- Creación de la tabla

~~~js
CREATE TABLE `kodotiwallet`.`wallet_subscription` (
  `id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `code` VARCHAR(45) NULL,
  `amount` DECIMAL NULL,
  `cron` VARCHAR(45) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`));
~~~

- La interfaz sería (en /domain/subscription.ts)

~~~js
export interface Subscription{
    id: number
    code: string
    user_id: number
    amount: number
    cron: string
    created_at: Date | null
    updated_at: Date | null
}
~~~

- Uso la interfaz porque es más fácil de usar que una clase
- La clase tengo que instanciarla, pasarle los valores a través del constructor y es tedioso
- En /impl creo la carpeta /mysql ( habrán otras para mysql_server y otra para las pruebas unitarias)
- Creo en src/repositories/impl/mysql/subscription.repository.ts para crear la clase SubscriptionRepository
- Importo de /common/persistence/mysql.persistence para conectar a mysql
  - Como hice un export default puedo llamarlo como quiera
- execute (que es asíncrono) me retorna un array, y dentro del array retorna otros arrays
    - Dónde están las filas encontradas en la base de datos va a ser en el índice 0
    - A través de la desestructuración de arrays de JavaScript vamos a acceder al índice 0
- Hago un casteo de rows y le digo que serán un array del tipo de la interfaz
- Cómo trabajo con una promesa, el retorno del método all será una  promesa de tipo Subscription[] 

~~~js
import connector from '../../../../common/persistence/mysql.persistence'
import { Subscription } from '../../domain/subscription'

export class SubscriptionRepository{

    public async all(): Promise<Subscription[]>{

        const [rows] = await connector.execute(
            'SELECT FROM wallet_subscription ORDER BY id DESC' 
        )

            //Si trabajara con clases en lugar de una interfaz aquí tendría que instanciar la clase Subscription
            //y pasarle por el constructor parametro 1, parámetro 2, etc

        return rows as Subscription[];
    }
}
~~~

- Creo el find (para encontrar un solo registro)
- Le pongo id = ? para evitar inyección de SQL
- El siguiente parámetro son los parámetros que queramos escapar en el orden que se vayan declarando las interrogaciones o comodines
- Va a traer un array igual, pero debería encontrar una sola fila por el id
- En el caso de que no haya registros voy a retornar un null
- Uso any[] como tipo para poder acceder al .length y hacer el if pra comprobar que haya registros o no
  - Debo agregar null al valor de retorno del método, el tipo Subscription ya no es un array
~~~js
import connector from '../../../../common/persistence/mysql.persistence'
import { Subscription } from '../../domain/subscription'


export class SubscriptionRepository{

    public async all(): Promise<Subscription[]>{
        const [rows] = await connector.execute(
            'SELECT FROM wallet_subscription ORDER BY id DESC' 
        )

        return rows as Subscription[]
    }
    public async find(id: Number): Promise<Subscription | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT FROM wallet_subscription WHERE id = ?', //pongo interrogación para evitar inyección de SQL
            
            //va a traer un array igual, pero debería devolver una sola fila
            [id]
        )
            if(rows.length){
                return rows[0] as Subscription //el valor de retorno del método es Subscription pero ya no es un array
            }
            
            return null  //debo agregar este tipo al valor de retorno del método
    }
}
~~~
-----

## Repositorio - métodos de escritura

