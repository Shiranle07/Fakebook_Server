# Fakebook Server

### Link to Repository
https://github.com/Shiranle07/Fakebook_Server.git

Fakebook Server is the backend server for the Fakebook social networking platform. It provides APIs for user authentication, managing posts, interacting with posts (like, comment), managing friendships, and more.

## How to Use?

### Prerequisites
Clone the repository to your local machine.

### 1. Installation
Navigate to the project directory and install dependencies using npm:

```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory of the project and add the necessary environment variables. For example:

```
MONGODB_URI=mongodb://localhost:27017/fakebook
JWT_SECRET=mysecretkey
```

### 3. Start the Server
Start the server using the following command:

```bash
npm start
```

### API Endpoints
- **Authentication**: `/api/auth`
  - `POST /register`: Register a new user.
  - `POST /login`: Log in a user.

- **User Management**: `/api/users`
  - `GET /`: Get information about all users.
  - `GET /:id`: Get information about a specific user.
  - `PUT /:id`: Update user information.
  - `DELETE /:id`: Delete a user.

- **Friendship Management**: `/api/friends`
  - `POST /add`: Send a friend request.
  - `POST /accept`: Accept a friend request.
  - `POST /reject`: Reject a friend request.
  - `DELETE /delete/:id`: Remove a friend.

- **Post Management**: `/api/posts`
  - `GET /`: Get all posts.
  - `GET /:id`: Get a specific post.
  - `POST /create`: Create a new post.
  - `PUT /update/:id`: Update a post.
  - `DELETE /delete/:id`: Delete a post.
  - `POST /like/:id`: Like a post.
  - `POST /unlike/:id`: Unlike a post.
  - `POST /comment/:id`: Comment on a post.
  - `DELETE /comment/:postId/:commentId`: Delete a comment on a post.

## Workflow
- **Task Understanding**: Understand the requirements of the task and divide them into manageable components.
- **Development**: Develop features and functionalities according to the assigned tasks.
- **Testing**: Conduct unit testing and integration testing to ensure the reliability and functionality of the APIs.
- **Code Review**: Conduct peer code reviews to ensure code quality and adherence to best practices.
- **Documentation**: Document APIs, code structure, and usage instructions for ease of use and understanding.

The server is structured to handle various functionalities of the Fakebook platform, including user management, authentication, friend requests, and post management. It follows a RESTful API design pattern and is thoroughly tested to ensure reliability and scalability.
