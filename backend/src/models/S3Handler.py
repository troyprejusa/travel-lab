from minio import Minio
from minio.error import S3Error
from utilities import Constants

try:
    print('S3Handler.py: Attempting to connect to file storage...')
    minio_client = Minio(
        "s3mock:9000",
        access_key=Constants.S3_ACCESS_KEY,
        secret_key=Constants.S3_SECRET_KEY
    )
    print('S3Handler.py: Connected to file storage')
except S3Error as e:
    raise Exception('S3Handler.py: Unable to connect to file storage')

# if not minio_client.bucket_exists("user-photos"):
#     minio_client.make_bucket("user-photos")
#     print('Created bucket user-photos')


# if not minio_client.bucket_exists("trip-photos"):
    # minio_client.make_bucket("trip-photos")
    # print('Create bucket trip-photos')
