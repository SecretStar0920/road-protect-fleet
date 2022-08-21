# Permanent Migrations

In some cases, we're implementing functionality on the database that you cannot do from the entities. There are no decorators, for example, that allow us to create triggers. So the migration files here are ones that should always run when starting up a new instance of the database.
