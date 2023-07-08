export const getTokenHeader = (): Headers => {
    return new Headers({
        'authorization': `BEARER ${localStorage.getItem("token")}`
    })
}
