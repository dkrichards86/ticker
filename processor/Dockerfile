FROM python:3
WORKDIR /code
RUN apt-get update && apt-get install -y postgresql-client
ADD ./src /code
ADD ./requirements.txt /code/requirements.txt
RUN pip install -r requirements.txt
RUN python -m spacy download en