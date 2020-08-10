# Anatomic S3 Trigger
>Trigger that will create the anatomic outline on a new image upload to public/uploads prefix

### How to update
* Edit lambda_function.py
* Compress all the files in anatomicOutline folder 
* Upload that zip file to anatomicOutline Lambda

### Download python package 
* Have to use linux docker image to download the package because lambda using AL2
* Good source on how to download [packages](https://medium.com/@samme/setting-up-python-3-6-aws-lambda-deployment-package-with-numpy-scipy-pillow-and-scikit-image-de488b2afca6)