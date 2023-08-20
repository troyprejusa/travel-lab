from models.Schemas import PollResponseBody, PollVoteBody


def merge_polls(data: list[dict]) -> list[dict]:
    # Note that the below logic relies on the data being sorted 
    # by poll_id. This is basically a merge intervals problem.

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
            # Save this to the output
            output.append(poll_body)

            # Start a new object
            poll_body = create_new_poll(row)
        
        else:
            # Append the option to the right place
            add_option_to_data(row, poll_body)
    
    # Add the last remaining item to the output
    output.append(poll_body)
    
    return output


def create_new_poll(row: dict) -> dict:
    poll_body = {}
    poll_body['poll_id'] = row['poll_id']
    poll_body['title'] = row['title']
    poll_body['anonymous'] = row['anonymous']
    poll_body['options'] = []

    new_vote = create_new_vote(row)

    append_possible_anon(new_vote, poll_body['anonymous'], row['voted_by'])

    # Add the vote option into the poll object
    poll_body['options'].append(new_vote)

    return poll_body

def create_new_vote(row: dict) -> dict:
    new_vote = {}
    new_vote['option_id'] = row['option_id']
    new_vote['option'] = row['option']
    new_vote['votes'] = []

    return new_vote


def add_option_to_data(row: dict, poll_body: dict) -> None:
    for option in poll_body['options']:
        if option['option_id'] == row['option_id']:
            append_possible_anon(option, poll_body['anonymous'], row['voted_by'])
            return
        
    # If we got to here, we didn't find a matching option. Add a new one.
    new_vote = create_new_vote(row)
    append_possible_anon(new_vote, poll_body['anonymous'], row['voted_by'])
    poll_body['options'].append(new_vote)
        

def append_possible_anon(poll_vote: dict, anonymous: bool, voter: str) -> None:
    if voter is None:
        return
    
    if anonymous:
        poll_vote['votes'].append('npc')
    else:
        poll_vote['votes'].append(voter)
