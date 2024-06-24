This is a node.js application for and Address Book api. The users can sign in, register and be authorized for creating address entry and address resources. The relationship between User entity and address entry entities is one to many(from the user to the address entry entity). The relationship between address entry entity to addresses is one to many.  

The requests are authorized using jwt library of node.js. Incoming request bodies are validated using JOI library. The users authenticate thorugh email and password. The passwords are stored salted and hashed. The project also makes use of the modular nature of middlewares and modules to handle verification and error handling.  The application is also organized in the MVC architecture. The controller components interact with data through the models data layer. Routes are also organized in their own directory. Some time benchmarks and improvements are shown in the screenshot for optimized sql queries. 