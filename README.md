# FYP
This is my Final Year Project for an NUI Galway Computer Science and IT degree (2016). Feel free to pick apart everything and anything. Definitely take a look at [the report](http://adriancooney.github.io/examist/book) which gives an overview of the technologies and the choices behind them.

[![Examist Screenshot](report/assets/2.png)](http://examist.xyz)

#### [Read the report online.](http://adriancooney.github.io/examist/book)

## Deploying
To deploy the application, we need Node.js/npm and Docker. First, compile the client:

    $ cd client
    $ npm install # Will take a while, grab some tea
    $ npm run build

Now, connect to your Docker machine and run:

    $ cd deploy
    $ docker-compose up

Done. Your application should be running on your Docker machine's ip (`docker-machine ip <machine> | pbcopy`). You can read more about the [Deploying in the report.](http://adriancooney.github.io/examist/book/development/deploying.html).

**Warning: The report is dense *and written in 3 days* so apologies in advance for formatting and grammar errors.**