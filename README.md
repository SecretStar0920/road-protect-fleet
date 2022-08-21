# Road Protect International

![STAGING - Build and Deploy](https://github.com/roadprotect/road-protect-fleet/workflows/STAGING%20-%20Build%20and%20Deploy/badge.svg)
![PRODUCTION - Build and Deploy](https://github.com/roadprotect/road-protect-fleet/workflows/PRODUCTION%20-%20Build%20and%20Deploy/badge.svg)

**Development**: ![TESTING - Standard Unit Tests](https://github.com/roadprotect/road-protect-fleet/workflows/TESTING%20-%20Standard%20Unit%20Tests/badge.svg)

**Production**: ![TESTING - Standard Unit Tests](https://github.com/roadprotect/road-protect-fleet/workflows/TESTING%20-%20Standard%20Unit%20Tests/badge.svg?branch=master)

A fleet management and infringement automation system allowing customers to manage the vehicles they lease, own and drive.

## Initial setup tasks

-   Having cloned the repo you need to initialise Git LFS
    -   See https://www.atlassian.com/git/tutorials/git-lfs#installing-git-lfs
    -   Usually `sudo apt-get install git-lfs` and then `git lfs install` (in the project directory)
-   Add empty .secrets files to the following folders:

    -   `devops/docker-compose/dev/backend`
    -   `devops/docker-compose/dev/database`
- Ensure you have docker and gcloud configured;
    - To configure gcloud, install gcloud SDK as instructed here https://cloud.google.com/sdk/docs/install.
    - Ensure gcloud adminstrators have given you the correct role to be authorised access to the relevant images.
    - Provide authorisation for communication between gcloud and docker by entering the following in terminal :
        ```bash
        gcloud auth configure-docker
        ```
### Backend

Technologies & Tools:

-   [Nestjs (latest)](https://nestjs.com/) - Backend Framework
-   [TypeOrm](https://typeorm.io/#/) - ORM interfacing with Postgresql (**NB**)

Required dependency usage:

-   Class Validator
-   Class Transformer

### Devops

Most of the devops is setup using our custom project CLI. Please install the cli using the _.deb_ file provided.

Having installed it, please initialise the cli in your project directory by navigating to the project route and running:

```bash
rp-cli init
```
#### Git Secret

Passwords and environment files are protected by `git-secret` [https://git-secret.io/](https://git-secret.io/). Please install `git-secret` and then get in contact with one of the developers on the project. You'll need to send them your public GPG key:

- To generate your public and secret keys, run `gpg --full-generate-key`
- To send your public key to the developer on your project, run these commands:

```bash
gpg --list-secret-keys --keyid-format LONG
# Now copy the email address or user ID linked to the PGP key
gpg --armor --export youremail@roadprotect.com
```

The result of the commands, copy and send them to the developer on the project.

The developer on the project should run:
```bash
gpg --import your_key.txt
git secret tell youremail@roadprotect.com
git secret hide
```

Once all of the files have been re-encrypted and pushed up, you can run,
```bash
git secret reveal
```

And you should have all of the latest env files. If you ever want to change one of the files, make the change and then run,
```bash
git secret hide
```

And commit the new files to the repository.

#### Dev
To setup the crawlers submodule run:
```bash
git submodule update --init --recursive
```
This will clone the crawler-api into the crawler-api folder.


Add this export to your .zshrc file. This export is used by document-api.
```angular2html
export LD_LIBRARY_PATH="usr/local/lib"
```

To start the development environment run:

```bash
rp-cli dev:start
```

This will build the correct docker files with the correct environments and link them all using a docker network.

We use nginx to proxy our frontend to our API and so CORS management is not required.

To restart a docker compose service run:

```bash
rp-cli dev:restart
```

To stop docker compose service run:

```angular2html
rp-cli dev:stop
```
#### Logs

You can view the logs by running:

```bash
rp-cli dev:logs
```

The following flags can be used with this command.

| Flag   | Description                       |
| ------ | --------------------------------- |
| -h     | Help                              |
| -t     | Docker compose type (dev or test) |
| -s     | Docker compose service            |
| -a     | Show all service logs             |
| --tail | Tail length                       |

#### Testing

To start the testing environment run:

```bash
rp-cli dev:start -t test
```

This will build the correct docker files with the correct environments and link them all using a docker network.

You can view the logs by running:

```bash
rp-cli dev:logs -t test
```

To restart a docker compose service during testing run:

```bash
rp-cli dev:restart -t test
```

If you want to filter out tests to run, you can edit the ignored `custom-test-config.json` file in the backend. This file is generated on running tests for the first time. The config includes the RegEx pattern to look for when running tests and this defaults to \*. If you only wanted to run raw infringement tests, you can change the pattern to 'raw'.

#### Initial database setup

_Note: the development environment needs to be running before you can configure the database_
To setup your database enter the backend directory, then enter scripts and run:

```bash
./initial-db-setup.sh
```

You can find the seeder module: `backend/src/modules/shared/modules/seeder` if you'd like to edit the seeds.

### Generating Migrations

For migrations when changing entities, you use `typeorm` to generate the skeleton in the following way:

1.  Check if your db is up to date
2.  Change entity/entities as required.
    If the table does not exist remember to add it to the `entities.ts` file so that typeorm will detect the changes.
3.  `cd backend/scripts`
4.  `./update-db.sh`
5.  Stop and start again,

```bash
rp-cli dev:stop
rp-cli dev:start
```

6.  `./typeorm-cli.sh "migration:run"`

#### Production - Kubernetes

Production and staging are managed via our Bitbucket Pipelines. Please avoid any manual deployments.

### Mail

Mail for local testing and staging testing is run through Mailhog. To access Mailhog locally visit [http://mail.localhost:3000](http://mail.localhost:3000) and use the username `roadprotect` and password `roadprotect`.

For staging, visit [https://mail.staging.roadprotect.co.il](https://mail.staging.roadprotect.co.il) and us the username `rpuser` and password `$tagingM4il`.

### Frontend

Technologies & Tools:

-   [Angular (latest)](https://angular.io/)
-   [Ngrx](https://ngrx.io/) (**NB**)
-   Class Transformer
-   Class Valid
-   [Ng-Zorro (Ant)](https://ng.ant.design/docs/introduce/en) (**NB**)

### Crawlers

The crawlers are pulled from a submodule [repo](https://github.com/roadprotect/road-protect-fleet-crawlers) originally created by a third party. You can run `rp-cli crawlers:update` to retrieve the latest changes from that repo. Ensure that you're on a branch that has been pushed to our origin and if you receive an error check that it's not because the submodule is already up to date and git is trying to commit empty changes.

Please refrain from making changes to the crawler code from within this repo. Rather pull down the crawler api repo and make changes there, push them to that repo's main, and run the crawler update command within this repo.

### Templates

Uses PlopJs [link](https://plopjs.com/) to generate repetitive boilerplate.

Currently options are available to generate CRUD module for an existing TypeOrm Entity. This will create a RESTful controller, basic services and a frontend that can request and store the provided entity. Note; some editing is required after creation of the modules to set keys for display tables and correct some imports.

To run install plop globally:

```bash
npm install -g plop
```

then run plop in the root directory of this project:

```bash
plop
```

The templates are in the templates folder and are handlebars, they may be updated as we go. There exists a plopfile.js in the root directory. This defines the generators and their associated prompts and actions. See [plopjs - getting started](https://plopjs.com/documentation/#getting-started) for more.

### Environments

-   This project runs best on **Linux** & Mac although it is possible to run on Windows.
-   Ensure your systems node version is at **v11.10** for when an npm install is done on the local system as opposed to within the container. This should be run in the following folders:
    -   backend
    -   cli
    -   document-api
    -   document-renderer
    -   frontend
-   **Docker** and **docker-compose** must be installed on the local system

### Standards

-   Ensure correct code formatters and **linters** are setup and installed.
    -   TSLint
    -   Prettier
-   WebStorm is recommended as the IDE.
-   Variable naming must follow the camelCase convention.
-   Everything must be typed - especially domain level models and flows
-   [Git Flow](https://danielkummer.github.io/git-flow-cheatsheet/) must be used for branching.
-   Branch names must include the PM Tool task ID and follow this format: `feature/RP-145/this-is-a-feature`
-   Epic branches may also be created: `epic/nomination`. Features for that epic may be merged into that epic and the epic may be merged into develop.
-   Pull Requests **must** be made for all code contributions.
    -   After the code has been approved the creator of the pull request must update it with latest develop and merge it into develop of the current release branch.
-   No direct database edits should need to be performed, use TypeOrm and entities to achieve the database changes or design required.

### Semantic Versioning
-   We make use of semantic versioning to ensure that we keep an up to date changelog. For development, this just means any merges into 'develop' or 'master' must be titled with:
    -   feat(feature-name): description
    *OR*
    -   fix(fix-name): description

#### Extra Notes

To setup Prettier for Webstorm, search 'Prettier' in settings. Check that the Prettier package path specified is the respective path to the `backend/node_modules/prettier`
