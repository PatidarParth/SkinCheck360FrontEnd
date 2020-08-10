import boto3
import os
import sys
import uuid
from urllib.parse import unquote_plus
from PIL import Image, ImageFilter, ImageOps 

s3_client = boto3.client('s3')

def getAnatomicImage(image_path, resized_path):
    with Image.open(image_path) as image:
        image = image.convert("L") 
        image = image.filter(ImageFilter.FIND_EDGES) 
        image = image.filter(ImageFilter.SMOOTH_MORE) 
        image = image.filter(ImageFilter.DETAIL) 
        image = image.filter(ImageFilter.SHARPEN) 
        image = image.filter(ImageFilter.EDGE_ENHANCE) 
        image = ImageOps.invert(image)
        image.save(resized_path)

def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = unquote_plus(event['Records'][0]['s3']['object']['key'])
    imageName = key.split('/')[-1]
    download_path = '/tmp/{}.jpeg'.format(imageName)
    upload_path = '/tmp/anatomicOutline-{}.jpeg'.format(imageName)
    s3_client.download_file(bucket, key, download_path)
    getAnatomicImage(download_path, upload_path)
    visitId = key.split('/')[-2]
    upload_key = 'public/anatomicOutline/{}/{}.jpeg'.format(visitId, imageName)
    s3_client.upload_file(upload_path, bucket, upload_key)