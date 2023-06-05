// Using snake_case to align with Python convention and 
// match case-insensitivity with SQL

export interface UserModel {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string
}

export interface TripModel {
    id: number,
    title: string,
    destination: string,
    description: string,
    start_date: Date,
    end_date: Date
}

export interface StopModel {
    id: number,
    title: string,
    description: string,
    start_date: Date,
    end_date: Date,
    confirmed: boolean
}

export interface PackingModel {
    id: number,
    item: string,
    quantity: number,
    description: string
}

export interface MessageModel {
    id: number,
    author: UserModel,
    content: string,
    date: Date
}

export interface TransportationModel {
    id: number,
    mode: string,
    start_date: Date, 
    end_date: Date
}

