// # --------------- DATABASE TYPES --------------- #
/* These match the SQL types nearly 1-1, with the exception
of non-serializable types (like Date/datetime) that cannot 
be sent, nor are they usable in the Redux store
*/

export interface TripModel {
  id: string;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  created_by: string;
}

export interface ItineraryModel {
  id: number;
  trip_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  created_at: string;
  created_by: string;
}

export interface PackingModel {
  id: number;
  trip_id: string;
  item: string;
  quantity: number;
  description: string | null;
  created_at: string;
  created_by: string;
  packed_by: string | null;
}

export interface MessageModel {
  id: number;
  trip_id: string;
  content: string;
  created_at: string;
  created_by: string;
}

// # --------------- COMPOSITE DATABASE TYPES --------------- #
// These types are a result of JOINs on SQL tables

export interface UserModel {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  confirmed: boolean;
  admin: boolean;
}

// # --------------- FASTAPI I/O TYPES --------------- #
// These types are used in I/O of FastAPI calls

export interface PollVoteModel {
  option_id: number;
  option: string;
  votes: Array<string>;
}

export interface PollResponseModel {
  poll_id: number;
  title: string;
  description: string | null;
  created_at: string;
  created_by: string;
  options: Array<PollVoteModel>;
}

// # --------------- WEBSOCKET TYPES --------------- #
// These types are used in websocket functionality

export interface NewPollModel {
  title: string;
  description: string | null;
  options: Array<string>;
}

export interface PollVoteWS {
  trip_id: string;
  poll_id: number;
  option_id: number;
  voted_by: string;
}

export interface MessageWS {
  trip_id: string;
  content: string,
  created_by: string,
}


// # --------------- FRONTEND TYPES --------------- #
// These are only used by the frontend
export interface PollChartDataPoint {
  option: string;
  count: number;
  voted_by: Array<string>;
}
