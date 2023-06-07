import psycopg2

con = psycopg2.connect(
    host = "localhost",
    port = "5433",
    user = "docker",
    password = "docker",
    database = "travel_lab"
)

cursor = con.cursor()