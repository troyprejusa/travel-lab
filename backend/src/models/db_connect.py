import psycopg2

try:
    con = psycopg2.connect(
        host = "localhost",
        port = "5433",
        user = "docker",
        password = "docker",
        database = "travel_lab"
    )
    print('Im connected')

    cursor = con.cursor()
    
except:
    print('no connection yo')

