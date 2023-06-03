import connector from '../../../../common/persistence/mysql.persistence'
import { BalanceRepository } from '../../balance.repository'
import { Balance } from '../../domain/balance'



export class BalanceMySQLRepository implements BalanceRepository {

    public async all(): Promise<Balance[]>{
        const [rows] = await connector.execute(
            'SELECT * FROM wallet_balance ORDER BY id DESC' 
        )

        return rows as Balance[]
    }
    public async find(id: Number): Promise<Balance | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_balance WHERE id = ?', //pongo interrogación para evitar inyección de SQL
            
            //va a traer un array igual, pero debería devolver una sola fila
            [id]
        )
            if(rows.length){
                return rows[0] as Balance
            }
            
            return null
    }

    public async findByUserAndCode(user_id: Number): Promise<Balance | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_balance WHERE user_id = ?', 
            
            
            [user_id]
        )
            if(rows.length){
                return rows[0] as Balance
            }
            
            return null
    }

    public async store(entry : Balance): Promise<void>{
        //creo la fecha para created_at
        const now = new Date();

            await connector.execute(
                'INSERT INTO wallet_balance(user_id, amount,created_at) VALUES(?,?,?)',
                //escapo los parámetros
                [entry.user_id, entry.amount, now]  
            )
    }
    
    public async update(entry : Balance): Promise<void>{

        const now = new Date();

            await connector.execute(                                                //le paso el now al updated_at
                'UPDATE wallet_balance SET user_id= ?, amount= ?, updated_at= ? WHERE id = ?',
                //escapo los parámetros                                     
                [entry.user_id, entry.amount, now, entry.id] //este entry.id hace referencia al id del WHERE  
            )
    }
    
    public async remove(id: number): Promise<void>{

        await connector.execute(
            'DELETE FROM wallet_balance WHERE id= ?',
            //le paso el id
            [id]
        )
    }
}