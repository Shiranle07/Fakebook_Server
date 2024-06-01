
### Link to Repository
https://github.com/Shiranle07/Fakebook_Server.git

### Link to Android Repository- "Faceapp"
https://github.com/I-am-Shir/Faceapp.git

### Link to Web Repository- "ap_project2_web"
https://github.com/Shiranle07/ap_project2_web.git

Fakebook Server is the backend server for the Fakebook social networking platform. It provides APIs for user authentication, managing posts, interacting with posts (like, comment), managing friendships, and more.

## How to Use?

### Prerequisites
Clone the repository to your local machine.
For a full experience, initialize the "users" collection and "posts" collection in your MongoDB, with the supplementary JSON files you can find on "Database" folder.
### 1. Installation
Navigate to the project directory and install dependencies using npm:

```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the config folder directory of the project and add the necessary environment variables. For example:

```
CONNECTION_STRING="mongodb://localhost:27017/Fakebook"
PORT=8080
```

### 3. Start the Server
Start the server using the following command:

```bash
npm start
```

### 4. Start the "AP_Project - Ex2 web"/"Faceapp"
Clone the repository "AP_Project - Ex2 web"/"Faceapp" and start the app using the appropriate command depending on the application you chose to use. 
We recommend logging in with one of our created users to enjoy all that our app has to offer:
user email: rachel@ww.com
password: 11112222

## Workflow

First, we read the task in its entirety together and checked that we correctly understood what was assigned to us. Together we came up with ideas for implementation in a general way and divided between us the general tasks that we added to JIRA. The first task was to divide the work, we decided that each one work on different task like Web, Android and Server. We used different branches on GitHub for every feature, and merge the branches only after making sure the code works. The code is structured with MCV structure. The server is structured to handle various functionalities of the Fakebook platform, including user management, authentication, friend requests, and post management.
