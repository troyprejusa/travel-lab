// Using snake_case to align with Python convention and 
// match case-insensitivity with SQL

export interface UserModel {
    id: string | null,
    first_name: string | null,
    last_name: string | null,
    email: string | null,
    phone: string | null
}

export interface TripModel {
    id: number,
    destination: string,
    description: string,
    start_date: Date,
    end_date: Date
}
