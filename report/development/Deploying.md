## 4.5 Deploying
Deploying apps in an efficient, automated and contained environment is an extremely hard problem to solve. There are many points of failure and huge effort is required to ensure the process is reliable and fault tolerant. Although this project had no users as of time of writing, best practices for large scale application deployment were used to ensure a streamlined process from not just a development perspective, but also as a user of the application.


## Deployment Solutions
The deployment process is much like setting up the testing pipeline in continuous integration. There were a few deployment strategies tested:

* **Manual deployment.**

  This involved SSH'ing into a server and manually running all commands necessary to setup the application environment, individually. These commands installed all the dependencies for the application such as Python, Nginx, PostgresSQL; moving all the required files to the server for the application (source code, configuration files, assets, database dump); configuring, starting, maintaining and monitoring the services such as the database and webserver. 
  
  This approach is unscalable and very error prone because it relies too much on the admin. The admin is a literal dependency for the server because any errors or exceptions must be fixed by the admin manually. 
  
* **Managed Deployment.**

  A managed deployment is when you let a third party service manage your services for you. You specify your infrastructure in a configuration file and the service will setup and manage the requirements for you. These services are usually paid and require little effort to get running however run into problems when scaling or custom configuration is required. The Heroku platform was tested as a deployment method for the app. The setup and deployment process for the python app was beautifully simple. It was simply a matter of  `heroku create` in the root of the app and the `git push heroku master` for live deployment. This was a preferred method but ultimately deemed to expensive.
  
* **Semi-managed Deployment**

  Another method briefly tested was using a semi-managed infrastructure which is an amalgamation of manual and managed deployment. You connect with a third-party service which creates and manages the services required for your application but leaves it up to the admin to configure and deploy the application. A semi-managed solution tested was using Amazon Web Services (AWS) using an EC2 (T2) server, an RDS (M) PostgreSQL master database server with Amazon S3 for user uploads and Route 53 for traffic management.
  
  ![](assets/aws.png)
  <figcaption><center>*Example infrastructure diagram on AWS for Examist created with CloudCraft.*</center></figcaption>
  
* **Container based deployment**

  The final deployment solution tested (and chosen) was container based deployment. Container based deployment is where you create your application in an isolated environment (called a "container") with the understanding that the environment will be replicated **exactly** anywhere the application is deployed. The container is created locally in essentially the same process as manual deployment where all application dependencies and resources are installed and copied to the container however this process only needs to be completed *once*. The container is then built, created and deployed anywhere. The software of choice for the containerization is **Docker**.

## Docker
![](assets/docker.png)

Docker is a full stack container management suite that helps with the building, creating, managing and deploying of containers. The concept behind docker is that every container starts with a base image (e.g. Ubuntu or Debian) and from there the application is built. Base images can be built from other existing images and the published to a central repository called Docker Hub. This make creating containers *fantastically* easy. For example, creating an application to serve static content is as simple as doing `docker -P run nginx` which downloads the offical Nginx image, copys the contents of the current directory to the container and starts the server. The `-P` flag maps the ports on the container to random ports on the host machine (useful for development) so if port `80` on the container is mapped to `44783` on the host, you could navigate to `<docker machine ip>:44783` and view your static content.

### Building the application container
Docker also introduces the concept of Dockerfiles. These are files that describe how to build your application's container by specifying commands to run within the container and "committing" the results. Below is our `server` Dockerfile which runs the Flask based python server (some commands to fix dependency specific errors are omitted).

```Dockerfile
FROM python:2.7

# Install Python dependency
RUN apt-get update
RUN apt-get -y install build-essential python-dev python-setuptools \
        python-numpy python-scipy \
        libatlas-dev libatlas3gf-base

# Copy our server code
COPY ./server /usr/src/server
WORKDIR /usr/src/server

# Install the server's dependencies and itself
RUN pip install -r requirements.txt
RUN pip install .

# Start the server
CMD ["python", "init.py"]
```

<aside style="width:50%;float:right">
	The Python base image is just another Dockerfile that inherits from a base linux distribution and installs Python 2.7.
</aside>

First off, our container inherits from the [`python:2.7` base image](https://hub.docker.com/_/python/). This gives us a base Python 2.7 installation for us to use to run our server. The server itself has a large list of dependencies (33 altogether) which all need to be installed to run it. Two of these dependencies, Scipy and Numpy, are particulary large and very resource heavy to install manually so we install them via the package manager `apt-get`. This small optimization saves a *huge* amount of time when building our containers. We install these two outliers first (and they depend on the other specify packages) using the `RUN` Docker command.

Next, we copy over our server's source to the container with the `COPY` command. This embeds the source code within the container so anywhere the container is deployed, the code goes with it. Once the source is copied over, we install all the dependencies specified in our server's `requirements.txt` via `pip install -r requirements.txt`. This process is quite lengthy because it has to download and setup each dependency. Finally, once the server's dependencies are installed, we install the server itself as if it were a package. By installing the server like this, it allows any code to import `server.*` and use the Flask app and SQL Alchemy models from anywhere.

These commands, in sequence, describe how we build our container for our app but do nothing by themselves. We send them to Docker who actually builds the container:

```sh
$ docker build -t examist-server .
Step 1 : FROM python:2.7
 ---> e4a554df875e
Step 2 : RUN apt-get update
 ---> 335926fb1abf
Removing intermediate container eh202h2g1k96
Step 3 : RUN apt-get -y install build-essential python-dev python-setuptools         python-numpy python-scipy         libatlas-dev libatlas3gf-base
 ---> 3b1a874caf1d
Removing intermediate container 3hd8b39dlsl1
Step 4 : RUN update-alternatives --set libblas.so.3       /usr/lib/atlas-base/atlas/libblas.so.3;     update-alternatives --set liblapack.so.3       /usr/lib/atlas-base/atlas/liblapack.so.3
 ---> 10255ef80cba
Removing intermediate container caayi211080h
Step 5 : RUN bash -c 'ln -s /usr/lib/python2.7/dist-packages/{numpy,scipy}* /usr/local/lib/python2.7/site-packages/'
 ---> c8e6f37b81ef
Removing intermediate container dshfd4afddsf
Step 6 : COPY ./server /usr/src/server
 ---> d9bb2171845b
Removing intermediate container 342d4a6075bc
Step 7 : WORKDIR /usr/src/server
 ---> Running in a001050fc986
 ---> 6de9388fde45
Removing intermediate container a001050fc986
Step 8 : RUN pip install -U -r requirements.txt
 ---> Running in 7dd492f5d5aa
...
 ---> 9f9aab0151b7
Successfully built 9f9aab0151b7
```

As you can see from the output above, Docker takes each command from the Dockerfile, runs it and generates our container image `9f9aab0151b7` (which we also tagged with the `-t` flag as `examist-server`). In programming terms, the **container image** is the class and the **container** is the instance of that container image. 

Notice someting very interesting about how Docker creates the final container image. Each `RUN` command takes the previous image (all the way back to `FROM`, which specifies the base image), creates a new *container* from that image, runs the command in that container *then* generates a new image based on the updated filesystem for use in the following `RUN` command. It's a stack based system that creates our final application container image ready to deploy.

Deployment of a container image is as simple as `docker run <image-name>`. This will create a new container and executes the `CMD` from our Dockerfile. As long as our `CMD` process is running, the Docker container will continue to run. Our server's Dockerfile starts our python Flask app by running `python init.py`:

	$ docker run examist-server
	* Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)

### Other Services
The server container is just the standalone Python Flask server. That isn't enough to run the whole app because it needs a frontend file server and database also to function correctly. We create two more, seperate containers for each of these services. Below is a brief overview:

#### Database container
The database container inherits from the [`postgres:9` base image](https://hub.docker.com/_/postgres/) which comes pre-installed with PostgreSQL, creates our default users (roles) and automatically executes any SQL files copied to a special `/docker-entrypoint-initdb.d/` when the container is created. Our Dockerfile looks like:

```Dockerfile
FROM postgres:9

ARG dump
COPY ./data/dumps/$dump /docker-entrypoint-initdb.d/
```

We have a special `ARG` command which allows build-time arguments to be passed to the Dockerfile. In our database's Dockerfile, we pass in the name of the database dump we want to copy to `/docker-entrypoint-initdb.d/` so we can always specify the latest dump.

#### Client container
The client container inherits from the `nginx` base image which installs [Nginx](https://www.nginx.com/), a high performance load balancer, web server and reverse proxy. Nginx is what faces the outside world and handles how each request should be handled by the server. We use Nginx to serve our client files (`index.html`, the javascript and CSS) on the root domain and also pass on any requests to the API onto the Flask Server, internally. The Dockerfile for out client:

```Dockerfile
FROM nginx

# Copy the client source code
COPY ./client /usr/src/client
# Copy our Nginx configuration
COPY ./client/nginx.conf /usr/src/client/nginx.conf

ENV NGINX_ENV_REPLACE '$DOMAIN'
CMD /bin/bash -c "envsubst '$NGINX_ENV_REPLACE' < /usr/src/client/nginx.conf > /etc/nginx/conf.d/client.conf && cat /etc/nginx/conf.d/client.conf && nginx -g 'daemon off;'"

```

### Environments
Out of the box, these containers don't know how to communicate with each other so without some configuration, they're pretty much useless. We could add the configuration during the build process in our Dockerfile however this is bad practice and ruins the *contained* aspect of the containers because hardcoding configuration is highly dependant on deployment environment (the anti-thesis of Docker).

Instead of hardcoding our configuration, we specify it on the fly using **environment variables**. These are named values passed to containers at runtime that are then passed down to any processes running within the container i.e. our apps. If we take our server container for example and it's configuration file:

```py
from os import environ as env

DB_USER = env["DB_USER"]
DB_PASS = env["DB_PASS"]
DB_HOST = env.get("DB_HOST", "localhost")
DB_PORT = int(env.get("DB_PORT", 5432))
DB_NAME = env["DB_NAME"]
```

The server's config requires three environment variables `DB_USER`, `DB_PASS` and `DB_NAME` (otherwise the app won't start) and two other optional variables which have sensible defaults. These variables tell the server how to connect to the database which resides in a totally different container. We pass them in like so:

	$ docker run -e DB_USER=postgres \
		-e DB_PASS=postgres \
		-e DB_NAME=exp \
		examist-server

This will configure our environment with those values and start the server. If we were to open a shell in the container and look at the value of `$DB_USER`, we would find the value `postgres`. Passing values like this at runtime also has the great **security advantage** over configuring at build time. Any passwords or sensitive keys are not hardcoded into the container image which could be accidentally distributed and dissected easily.

### Composing our services
Now we have three standalone, configurable containers with no configuration so they don't know how to communicate with each other just yet. The final concept to be introduced is **Docker Compose**. Docker compose is a tool that will take an input configuration file `docker-compose.yml` which specifies each services and their environments, builds, creates and deploys them on the same network. It does a lot of other cool stuff under the hood to make communication between them as easy as possible. The `docker-compose.yml` for our application:

```yaml
services:
  server:
    build: 
      dockerfile: ./deploy/server.docker
    environment:
      DB_NAME: exp
      DB_USER: postgres
      DB_PASS: postgres
      DB_HOST: db
      APP_PORT: 5000
      APP_HOST: "0.0.0.0"
    links: 
      - db
    expose:
      - 5000
  client:
    build: 
      dockerfile: ./deploy/client.docker
    environment:
      DOMAIN: examist.xyz
    links:
      - server
    ports:
      - "80:80"
  db:
    build: 
      dockerfile: ./deploy/db.docker
      args:
        dump: exp-03042016-1803.sql
    expose:
      - 5432
```

Take a look at our `db` service first. We specify our `dump` file as a build time argument that will create the database container with the given dump. We also have an `expose` attribute with a value of `5432`. This is the default port Postgres listens on and we *expose* that port on the `db` container so that any containers on the same network can access the `db` via the port.

<aside style="width: 50%; float:right">
	The <code>postgres</code> base image creates a default user "postgres" with the password "postgres". The "exp" database comes from our database dump. This is where we get the values you see for the environment variables in the <code>server</code> service. 
</aside>

Our next and most important service is the `server`. The server requires the database so we add a *link* to it's service. The `link` tells Docker that the `db` service is a dependency of the `server` service and will start (or re-build or re-create) the `db` service anytime the `server` service is started (or updated). We pass in our environment variables that will allow the server to connect to the database and expose the port 5000, the application's port.

Docker Compose also has the handy feature of adding the names of the linked services to the `hosts` file of each dependant service which points to the linked container in the network. For example, since the `server` service depends on the `db` service, it's possible to access the database container from within the server container by `postgresql://db:5432` (as long as the correct ports are `EXPOSE`'d also, like we did above). This explains the "db" as the value for the `DB_HOST` environment variable in the `server` service configuration.

Our final service is the `client` service which depends on the `server` service (and thus `db`). We specify it's configuration as environment variables, the `DOMAIN` indicates the domain Nginx will accept connections on. We also have a `ports` attribute which specify how the outside world can access the container. All the other containers are only accessible from within the container network however the `ports` attribute allows us to map a port on the host machine to a port on the network. For our application, we map the port 80 on the *host machine* to access port 80 on the *client container*.

Once the configuration is setup, we pass it onto `docker-compose up` to start all the services correctly in-line with the dependency tree. Now we have the full application up and running on `<host ip>:80`!

	$ docker-compose up
	Starting deploy_db_1
	Starting deploy_server_1
	Starting deploy_client_1
	Attaching to deploy_db_1, deploy_server_1, deploy_client_1

### Deploying
Now for the easy part, actually pushing our containers to a server. We could opt to allocate a physical (or virtual) server for each *service* however that would be expensive and unnecessary at this scale. Instead, we opt to deploy the three containers to a single server on DigitalOcean.

Before now, Docker works on a "host machine" via `docker-machine`. This is the host computer itself (or a VM running inside the host computer) which docker sends it's commands to. This is not to be confused with a container itself. The *host machine* is an abstraction to allow docker to deploy anywhere, it doesn't discriminate between machines which allows admins to switch between machines and contexts with great ease. For example, on OSX, Docker isn't fully supported on top of the main OS so a VM is spawned via Virtualbox and sets up a Docker environment within the VM. Any command we run thereafter is run *inside* the VM and not on the host OS as you'd expect. Now, if you want to deploy to a remote server, you simply switch the VM for the remote server and you are now deploying to live production.

With this in mind, we create our DigitalOcean server which conveniently has creating "machines" on DigitalOcean built right into docker (as a *driver*):

	$ docker-machine create \
		--driver digitalocean \
		--digitalocean-access-token <xxxxx> \
		examist-app

Now we have our machine (or "Droplet" as DigitalOcean calls it) created, we need to ensure that commands will be sent to this machine. The machine you deploy to is specified by `DOCKER_HOST` environment variable (*on the host computer environment where you run the commands, not the container environment*) that is connected to every time you run a command. The `docker-machine` utility has a handy command to setup environments automatically for you via `eval $(docker-machine env <machine>)`. With this in mind, we setup our DigitalOcean's machine to work:

	$ eval $(docker-machine env examist-app)
	
And to complete our deployment, we run `docker-compose up -d` to run start the containers in detached mode:

	$ docker-machine up -d
	
Now our application is available online on DigitalOcean's servers! All that's left now is to point our domain to the IP allocated for our server and the application is successfully running online.


#### Lessons Learned
Although the deployment process itself is extremely smooth, reaching that point was not. There was many obscure bug that took hours to get past:

* The Flask application does not expose itself on the internal container network when in debug mode. This made for an *extremely* frustrating hidden bug that wasted countless hours trying to understand why Nginx was giving *Bad Gateway* errors when trying to forward traffix. It was fixed by taking the app out of debug mode by ensuring the `APP_DEBUG` environment variable resolved to `False`.

* Nginx does not support having environment variables in it's config file and the suggested utility by the Docker repository is `envsubst` to replace variables in the form of `$varname` inside the configuration text file (essentially hardcode the values). Nginx's internal variables which conveniently are also in the form of `$varname` which the configuration used to add CORS support. `envsubst` would just remove the variables it couldn't substitute, leaving a blank space where the original, Nginx variable reference would be. When starting, Nginx would just output that the configuration is broken. To ensure `envsubst` didn't remove the internal variables, you could specify a second parameter to `envsubst` with a colon seperated list of values to replace. Since `$DOMAIN` was the only environment variable used in the Nginx configuration file `envsubst '$DOMAIN'` should have been enough to fix it however this was not the case. Due to how we ran the `client`'s container `CMD` within a `bash -c "<command>"`, bash would substitute variables of the form `$varname` within double quotes to anything in the environment. This lead to an *extremely* frustrating and taxing debugging session where the first unintended substitution by bash was discovered. To fix it, we had to stick the name of the variable (**unsubtituted**) into another variable and use it as the varible name within `envsubst`. It's quite hard to wrap your head around.

	```
	ENV NGINX_ENV_REPLACE '$DOMAIN'
	CMD /bin/bash -c "envsubst '$NGINX_ENV_REPLACE' \
		< /usr/src/client/nginx.conf \
		> /etc/nginx/conf.d/client.conf"
	```