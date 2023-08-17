// Using snake_case to align with Python convention and 
// match case-insensitivity with SQL

// All interface types will be string,
// as the data from the backend will come
// in as a string, and non-serializable
// types like Date cause issues in redux store

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
    start_date: string,
    end_date: string,
    created_at: string,
    created_by: string
}

export interface ItineraryModel {
    id: number
    trip_id: string
    title: string
    description: string
    start_time: string
    end_time: string
    created_at: string
    created_by: string
}

export interface MessageModel {
    id: number
    trip_id: string
    content: string
    created_at: string
    created_by: string
}

export interface PollModel {
    id: number
    trip_id: string
    title: string
    anonymous: boolean
    created_at: string
    created_by: string
}

export interface PollOptionModel {
    id: number
    poll_id: number
    option: string
}

export interface PollVoteModel {
    id: number
    poll_id: number
    vote: string
    voted_at: string
    voted_by: string
}

// export interface PollBackendResponse {
//     title: string
//     anonymous: boolean
//     created_by: string
//     option: string
//     vote: string
//     voted_by: string
// }
