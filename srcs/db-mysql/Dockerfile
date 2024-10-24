FROM mysql:latest

ENV PORT=${MYSQL_PORT}

COPY ./init.sql ./docker-entrypoint-initdb.d/init.sql

EXPOSE ${PORT}

#CMD ["mysql"]
CMD ["mysqld"]