FROM postgres:17

EXPOSE 5432

# Copy the dump file into the container.
# The file will be executed when the container starts, as docs says -> https://hub.docker.com/_/postgres#:~:text=and%20POSTGRES_DB.-,Initialization%20scripts,-If%20you%20would
COPY dump-sito_annunci.sql /docker-entrypoint-initdb.d/dump-sito_annunci.dump
COPY restore-dump.sh /docker-entrypoint-initdb.d/restore-dump.sh
RUN chmod +x /docker-entrypoint-initdb.d/restore-dump.sh

# Default entrypoint script for PostgreSQL
ENTRYPOINT ["docker-entrypoint.sh"]
# Default command to run PostgreSQL server
CMD ["postgres"]
