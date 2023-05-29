import connector from '../../../../common/persistence/mysql.persistence'
import { Subscription } from '../../domain/subscription'
import { SubscriptionRepository } from '../../subscription.repository'


export class SubscriptionMySQLRepository implements SubscriptionRepository {

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
                return rows[0] as Subscription
            }
            
            return null
    }

    public async findByUserAndCode(user_id: Number, code: string): Promise<Subscription | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT FROM wallet_subscription WHERE id = ? AND code= ?', //pongo interrogación para evitar inyección de SQL, añado code
            
            
            [user_id, code]
        )
            if(rows.length){
                return rows[0] as Subscription
            }
            
            return null
    }

    public async store(entry : Subscription): Promise<void>{
        //creo la fecha para created_at
        const now = new Date();

            await connector.execute(
                'INSERT INTO wallet_subscription(user_id, code, amount, cron, created_at) VALUES(?,?,?,?,?)',
                //escapo los parámetros
                [entry.user_id, entry.code, entry.amount, entry.cron, now]  
            )
    }
    
    public async update(entry : Subscription): Promise<void>{

        const now = new Date();

            await connector.execute(                                                //le paso el now al updated_at
                'UPDATE wallet_subscription SET user_id= ?, code= ?, amount= ?, cron=?, updated_at= ? WHERE id = ?',
                //escapo los parámetros                                     
                [entry.user_id, entry.code, entry.amount, entry.cron, now, entry.id] //este entry.id hace referencia al id del WHERE  
            )
    }
    
    public async remove(id: number): Promise<void>{

        await connector.execute(
            'DELETE FROM wallet_subscription WHERE id= ?',
            //le paso el id
            [id]
        )
    }
}