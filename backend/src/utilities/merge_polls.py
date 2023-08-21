from models.Schemas import PollResponseBody, PollVoteBody


def merge_polls(data: list[dict]) -> list[dict]:
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
    poll_body = create_new_poll(data[0])
    for i in range(1, len(data)):
        row = data[i]
        if row['poll_id'] != poll_body['poll_id']:
            # Save the previous poll data to the output
            output.append(poll_body)

            # Create a new poll object
            poll_body = create_new_poll(row)
        
        # Append this vote to the right place
        add_vote_to_poll(row, poll_body)
    
    # Add the last remaining item to the output
    output.append(poll_body)
    
    return output


def create_new_poll(row: dict) -> dict:
    poll_body = {}
    poll_body['poll_id'] = row['poll_id']
    poll_body['title'] = row['title']
    poll_body['anonymous'] = row['anonymous']
    poll_body['created_at'] = row['created_at']
    poll_body['created_by'] = row['created_by']
    poll_body['options'] = []

    new_vote = create_new_option(row)

    # Add the vote option into the poll object
    poll_body['options'].append(new_vote)

    return poll_body

def create_new_option(row: dict) -> dict:
    new_vote = {}
    new_vote['option_id'] = row['option_id']
    new_vote['option'] = row['option']
    new_vote['votes'] = []

    return new_vote


def add_vote_to_poll(row: dict, poll_body: dict) -> None:
    # Check if this option already exists in the options
    for option in poll_body['options']:
        if option['option_id'] == row['option_id']:
            append_vote(option, poll_body['anonymous'], row['voted_by'])
            return
        
    # If we got to here, we didn't find an existing option. Add a new one.
    new_vote = create_new_option(row)
    append_vote(new_vote, poll_body['anonymous'], row['voted_by'])
    poll_body['options'].append(new_vote)
        

def append_vote(poll_vote: dict, anonymous: bool, voter: str) -> None:
    if voter is None:
        return
    
    if anonymous:
        poll_vote['votes'].append('npc')
    else:
        poll_vote['votes'].append(voter)
