// Using snake_case to align with Python convention and 
// match case-insensitivity with SQL

export interface UserModel {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string
}

export interface TripModel {
    id: string,
    destination: string,
    description: string,
    start_date: Date | string,
    end_date: Date | string,
    created_at: Date | string
}

export interface ItineraryModel {
    id: number
    traveller_id: string
    trip_id: string
    title: string
    description: string
    start_date: Date | string
    end_date: Date | string
}
