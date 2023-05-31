export interface SubscriptionCreateDto{
    code: string
    user_id: number
    amount: number
    cron: string
}

export interface SubscriptionUpdateDto{
    code: string 
    //según las reglas de negocio que aplico el user_id no lo necesito en update
    amount: number 
    cron: string 
}
