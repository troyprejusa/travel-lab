/* Note:
Some of the types here will not be 1-1 with 
the actual SQL or Python types, because 
non-serializable types (like Date/datetime) 
cannot be sent, nor are they usable in 
the Redux store
*/

// # --------------- DATABASE TYPES --------------- #

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

export interface UserModel {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  confirmed: boolean;
  admin: boolean;
}

// # --------------- CUSTOM TYPES --------------- #

export interface NewPollModel {
  title: string;
  description: string | null;
  options: Array<string>;
}

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

export interface PollChartDataPoint {
  option: string;
  count: number;
  voted_by: Array<string>;
}

export interface PollVoteSendModel {
  // Data needed to save a poll vote and be distributed
  // out to other listeners on the websocket
  trip_id: string;
  poll_id: number;
  option_id: number;
  voted_by: string;
}
