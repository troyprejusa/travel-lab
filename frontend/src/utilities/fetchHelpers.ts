const fetchHelpers = {

    getTokenHeader(): Headers {
        return new Headers({
            'authorization': `BEARER ${localStorage.getItem("token")}`
        })
    }
    
}

export default fetchHelpers;
