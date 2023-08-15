const fetchHelpers = {

    getTokenHeader(): Headers {
        return new Headers({
            'authorization': `BEARER ${localStorage.getItem("token")}`
        })
    },

    getTokenJSONHeader(): Headers {
        return new Headers({
            'authorization': `BEARER ${localStorage.getItem("token")}`,
            'content-type': 'application/json'
        })
    }
    
}

export default fetchHelpers;
