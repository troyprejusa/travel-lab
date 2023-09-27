from models.Schemas import PollResponse, PollVoteResponse


def merge_polls(data: list[dict]) -> list[PollResponse]:
    # Note that the below logic relies on the data being sorted 
    # by poll_id from the query. After that, this is basically
    # the merge intervals problem
    #
    # Per FastAPI, can either return actual constructions of 
    # the various classes or we can return dictionaries. One
    # problem is that with the BaseModel schemas, you must
    # provide all fields at construction with key/val pairs,
    # which makes iterative generation useless. I guess we
    # have to use dictionaries.

    if len(data) == 0:
        return []
        
    output = []

    # Create the first poll
    poll_body = create_new_poll(data[0])
    add_vote_to_poll(data[0], poll_body)

    for i in range(1, len(data)):
        row = data[i]
        if row['poll_id'] != poll_body.poll_id:
            # Save the previous poll data to the output
            output.append(poll_body)

            # Create a new poll object
            poll_body = create_new_poll(row)

        # Append this vote to the right place
        add_vote_to_poll(row, poll_body)
    
    # Add the last remaining item to the output
    output.append(poll_body)
    
    return output


def create_new_poll(row: dict) -> PollResponse:
    new_option = create_new_option(row)

    poll_body = {}
    poll_body['poll_id'] = row['poll_id']
    poll_body['title'] = row['title']
    poll_body['description'] = row['description']
    poll_body['created_at'] = row['created_at']
    poll_body['created_by'] = row['created_by']
    poll_body['options'] = [new_option]

    new_poll = PollResponse.parse_obj(poll_body)

    return new_poll

def create_new_option(row: dict) -> PollVoteResponse:
    new_option = {}
    new_option['option_id'] = row['option_id']
    new_option['option'] = row['option']
    new_option['votes'] = []

    return PollVoteResponse.parse_obj(new_option)


def add_vote_to_poll(row: dict, poll_body: PollResponse) -> None:
    # Check if this option already exists in the options
    for idx, option in enumerate(poll_body.options):
        if row['option_id'] == option.option_id:
            add_vote_to_option(idx, row['voted_by'], poll_body)
            return
        
    # If we got to here, we didn't find an existing option. Add a new one.
    new_option = create_new_option(row)
    poll_body.options.append(new_option)

    add_vote_to_option(len(poll_body.options) - 1, row['voted_by'], poll_body)
        

def add_vote_to_option(idx: int, voter: str | None, poll_body: PollResponse) -> None:
    if voter is None:
        return
    
    poll_body.options[idx].votes.append(voter)
