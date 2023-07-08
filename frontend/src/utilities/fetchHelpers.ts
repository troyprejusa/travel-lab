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
    },

    getTokenFormHeader(): Headers {
        return new Headers({
            'authorization': `BEARER ${localStorage.getItem("token")}`,
            'content-type': 'application/x-www-form-urlencoded'
        })
    }
    
}

export default fetchHelpers;
