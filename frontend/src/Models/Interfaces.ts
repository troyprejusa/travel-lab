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
    id: string | null,
    destination: string | null,
    description: string | null,
    start_date: Date | null,
    end_date: Date | null
}
