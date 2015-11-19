# Blackbaud SKY API Authorization Code Flow Tutorial

Blackbaud SKY API Authroization Code Flow demo application.

## About

The Blackbaud SKY API currently supports the [Authorization Code Flow](https://apidocs.nxt.blackbaud-dev.com/docs/authorization/), which requires a back-end server component to securely store the client secret.  For this code sample, we've implemented the server component using NodeJS.  

We've stripped down the user interface to highlight the Authorization Code Flow.  Our [Barkbaud code samples](https://apidocs.nxt.blackbaud-dev.com/docs/code/) provide a rich user interface using [SKY UX](http://skyux.developer.blackbaud.com/).  

Feel free to leave feedback by filing an [issue](https://github.com/blackbaud/sky-api-auth-tutorial/issues).

Be sure to read the associated [Auth Code Flow Tutorial](https://apidocs.nxt.blackbaud-dev.com/docs/authorization/auth-code-flow/tutorial/) within our documentation. 

## Run this app on your server

To run this application in your environment, you will need to complete the following steps:

### Prerequisites

0. A server, such as your local machine, capable of running [NodeJS](https://nodejs.org/en/).
0. A reliable internet connection for cloning the repo and installing this project's dependencies.
0. If you have not already done so, be sure to complete the <a href="https://apidocs.nxt.blackbaud-dev.com/docs/getting-started/">Getting started guide</a>.  This will guide you through the process of signing up for a Blackbaud developer account and requesting a subscription to an API product.  Once approved, your subscription will contain a **Primary key** and a **Secondary key**.  You can use either key as the subscription key value for the `bb-api-subscription-key` request header in calls to the API. You can view your subscription keys within your [profile](https://developer.nxt.blackbaud-dev.com/developer). 
0. [Register your application](https://developer.nxt.blackbaud-dev.com/comingsoon) in order to obtain the **Application ID** (client id) and **Application secret** (client secret).  If you plan on running this sample on your local machine, be sure to supply a **Redirect URI** of `https://localhost:5000/auth/callback`.
0. We assume you know how to clone a repo and use a command line interface (CLI) such as Terminal or the Windows Command Prompt.  

### Setup

Be sure to read the associated [Auth Code Flow Tutorial](https://apidocs.nxt.blackbaud-dev.com/docs/authorization/auth-code-flow/tutorial/) within our documentation. 

0. Fork or clone this repository.
0. Prepare environment:
  0. Copy the environment file named **.env.sample** as **.env**.
  0. Update the **.env** file with the following values.
    * AUTH_CLIENT_ID = Your registered application's **Application ID**.  See [Managing your apps](https://apidocs.nxt.blackbaud-dev.com/docs/apps/).
    * AUTH_CLIENT_SECRET = Your registered application's **Application secret**.
    * AUTH_SUBSCRIPTION_KEY = Provide your **Subscription key**.  Use either the **primary key** or **secondary key**.  See your [profile](https://developer.nxt.blackbaud-dev.com/developer).
    * AUTH_REDIRECT_URI = One of your registered application's **Redirect URIs**. As you try out this sample locally, use `https://localhost:5000/auth/callback`.  See [Managing your apps](https://apidocs.nxt.blackbaud-dev.com/docs/apps/).
  0. Review the `.gitignore` file which specifies untracked files to ignore within git.  Note how the `.env` file is ignored. This prevents your registered application's keys from being exposed to everyone else on GitHub. 
0. On your local machine:  
  0. Within the command prompt, change to the working directory: `cd sky-api-auth-tutorial`.
  0. Run `npm install`.  **npm** is the package manager for **nodejs**.  `npm install` installs all modules that are listed within the **package.json** file and their dependencies into the local **node_modules** directory.  
  0. Run `source .env` to load the environment variables into your node app. 
  0. Run `node index.js` to start the app on localhost port 5000. 
  0. Open your browser to [https://localhost:5000/](https://localhost:5000/).
  
  <pre><code>$ cd sky-api-auth-tutorial
  sky-api-auth-tutorial $ npm install
  sky-api-auth-tutorial $ source .env 
  sky-api-auth-tutorial $ node index.js
  
  ==>  Now browse to https://localhost:5000/
  </code></pre>
  
