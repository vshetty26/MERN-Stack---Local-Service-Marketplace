# MERN Stack Complete Reference Guide

## Table of Contents
- [React](#react)
- [Express.js](#expressjs)
- [Node.js](#nodejs)
- [MongoDB/Mongoose](#mongodbmongoose)

---

## React

### React Components
- **Component**: Basic building block for React applications that returns JSX
- **Functional Component**: Modern React component using functions and hooks
- **Class Component**: Legacy React component using classes and lifecycle methods
- **PureComponent**: Component that implements shouldComponentUpdate with shallow prop comparison
- **Memo**: Higher-order component that memoizes functional components

### React Hooks
- **useState**: Manages local state in functional components
- **useEffect**: Handles side effects like data fetching, subscriptions, DOM manipulation
- **useContext**: Accesses React context values without prop drilling
- **useReducer**: Manages complex state logic similar to Redux reducer
- **useCallback**: Memoizes functions to prevent unnecessary re-renders
- **useMemo**: Memoizes expensive calculations to optimize performance
- **useRef**: Creates mutable references to DOM elements or values
- **useImperativeHandle**: Customizes instance values exposed to parent components
- **useLayoutEffect**: Synchronous effect that runs after DOM mutations
- **useDebugValue**: Displays custom hook label in React DevTools
- **useDeferredValue**: Defers updates to non-critical parts of the UI
- **useTransition**: Marks state updates as non-blocking transitions
- **useId**: Generates unique IDs for form inputs and accessibility
- **useFetcher**: Manages data fetching with loading and error states
- **useFormStatus**: Tracks form submission status in React 19
- **useActionState**: Manages state derived from async actions

### React Properties
- **props**: Read-only data passed from parent to child components
- **children**: Special prop containing nested JSX elements
- **key**: Unique identifier for list items to help React identify changes
- **ref**: Reference to DOM element or component instance
- **className**: CSS class name for styling elements
- **style**: Inline CSS styles object
- **defaultProps**: Default property values for components
- **propTypes**: Type checking for component props

### React Lifecycle Methods
- **componentDidMount**: Runs after component is inserted into DOM
- **componentDidUpdate**: Runs after component updates occur
- **componentWillUnmount**: Runs before component is removed from DOM
- **shouldComponentUpdate**: Determines if component should re-render
- **getSnapshotBeforeUpdate**: Captures values before DOM updates
- **componentDidCatch**: Catches JavaScript errors in component tree

### React Event Handling
- **onClick**: Mouse click event handler
- **onChange**: Input change event handler
- **onSubmit**: Form submission event handler
- **onKeyPress**: Keyboard key press event handler
- **onFocus**: Element focus event handler
- **onBlur**: Element blur event handler
- **onMouseEnter**: Mouse enter event handler
- **onMouseLeave**: Mouse leave event handler

### React Router
- **BrowserRouter**: Provides routing context using HTML5 history API
- **Routes**: Container for multiple Route components
- **Route**: Defines path-to-component mapping
- **Link**: Navigation component that prevents page reloads
- **Navigate**: Programmatic navigation component
- **useParams**: Accesses URL parameters in route components
- **useNavigate**: Programmatic navigation hook
- **useLocation**: Accesses current location object
- **Outlet**: Renders child routes in parent route components

### React State Management
- **useState**: Local component state management
- **useReducer**: Complex state logic with reducer pattern
- **Context**: Global state sharing without prop drilling
- **useContext**: Accesses context values in components
- **createContext**: Creates context for state sharing

### React Styling
- **className**: CSS class for styling
- **style**: Inline style object
- **CSS Modules**: Scoped CSS with automatic class name generation
- **Styled Components**: CSS-in-JS styling solution
- **Tailwind**: Utility-first CSS framework
- **Styled-jsx**: CSS-in-JS for React components

---

## Express.js

### Express Methods
- **get()**: Handles GET HTTP requests for specified route
- **post()**: Handles POST HTTP requests for data creation
- **put()**: Handles PUT HTTP requests for full resource updates
- **patch()**: Handles PATCH HTTP requests for partial updates
- **delete()**: Handles DELETE HTTP requests for resource deletion
- **all()**: Handles all HTTP methods for specified route
- **use()**: Registers middleware for all routes

### Express Middleware
- **express.json()**: Parses JSON request bodies
- **express.urlencoded()**: Parses URL-encoded request bodies
- **express.static()**: Serves static files from directory
- **cors()**: Enables Cross-Origin Resource Sharing
- **morgan()**: HTTP request logger middleware
- **helmet()**: Security middleware for HTTP headers
- **compression()**: Compresses HTTP responses
- **cookieParser()**: Parses Cookie header into req.cookies
- **session()**: Session management middleware
- **bodyParser()**: Parses incoming request bodies

### Express Properties
- **req.body**: Contains parsed request body data
- **req.params**: Contains route parameters from URL
- **req.query**: Contains URL query parameters
- **req.headers**: Contains HTTP request headers
- **req.cookies**: Contains cookies sent by client
- **req.method**: Contains HTTP request method
- **req.url**: Contains request URL
- **req.path**: Contains request pathname
- **req.ip**: Contains client IP address
- **req.protocol**: Contains request protocol (HTTP/HTTPS)
- **req.hostname**: Contains request hostname
- **req.get()**: Gets specific request header value
- **res.status()**: Sets HTTP response status code
- **res.send()**: Sends HTTP response
- **res.json()**: Sends JSON response
- **res.end()**: Ends response process
- **res.redirect()**: Redirects to specified URL
- **res.render()**: Renders view template
- **res.locals**: Contains response local variables

### Express Routing
- **Router**: Creates modular route handlers
- **app.route()**: Creates route-specific middleware
- **app.param()**: Adds callback triggers for route parameters
- **app.set()**: Sets application settings
- **app.get()**: Gets application settings
- **app.locals**: Contains application local variables

### Express Error Handling
- **next()**: Passes control to next middleware function
- **app.use()**: Registers error-handling middleware
- **error middleware**: Special middleware with (err, req, res, next) signature
- **throw**: Throws errors to be caught by error handlers

---

## Node.js

### Global Objects
- **global**: Global object containing all global variables
- **process**: Provides information about current process
- **console**: Console object for output and debugging
- **Buffer**: Raw binary data manipulation
- **__dirname**: Current directory path
- **__filename**: Current file path
- **exports**: Module exports shortcut
- **require()**: Function to import modules
- **module**: Reference to current module
- **setTimeout()**: Executes function after specified delay
- **setInterval()**: Executes function repeatedly
- **clearTimeout()**: Cancels timeout created by setTimeout()
- **clearInterval()**: Cancels interval created by setInterval()

### File System (fs)
- **fs.readFile()**: Asynchronously reads entire file
- **fs.writeFile()**: Asynchronously writes data to file
- **fs.appendFile()**: Asynchronously appends data to file
- **fs.unlink()**: Asynchronously deletes file
- **fs.mkdir()**: Asynchronously creates directory
- **fs.rmdir()**: Asynchronously removes directory
- **fs.readdir()**: Asynchronously reads directory contents
- **fs.existsSync()**: Synchronously checks if file exists
- **fs.stat()**: Gets file statistics
- **fs.rename()**: Renames file or moves it

### Path
- **path.join()**: Joins path segments into normalized path
- **path.resolve()**: Resolves path to absolute path
- **path.parse()**: Returns path object with properties
- **path.format()**: Returns path string from path object
- **path.dirname()**: Returns directory path
- **path.basename()**: Returns filename part of path
- **path.extname()**: Returns file extension
- **path.normalize()**: Normalizes path string

### HTTP
- **http.createServer()**: Creates HTTP server
- **http.createClient()**: Creates HTTP client
- **http.request()**: Makes HTTP request
- **http.get()**: Makes GET HTTP request
- **res.writeHead()**: Writes HTTP response headers
- **res.end()**: Ends response
- **req.on()**: Listens for request events

### URL
- **url.parse()**: Parses URL string into object
- **url.format()**: Returns URL string from object
- **url.resolve()**: Resolves relative URL to absolute URL
- **URL class**: Modern URL parsing and manipulation

### Events
- **EventEmitter**: Base class for emitting and listening to events
- **emit()**: Emits named event
- **on()**: Adds listener for specified event
- **once()**: Adds one-time listener for event
- **removeListener()**: Removes specific listener
- **removeAllListeners()**: Removes all listeners for event
- **listeners()**: Returns array of listeners for event

### Crypto
- **crypto.createHash()**: Creates hash object
- **crypto.createHmac()**: Creates HMAC object
- **crypto.createCipher()**: Creates cipher object
- **crypto.createDecipher()**: Creates decipher object
- **crypto.randomBytes()**: Generates cryptographically strong random bytes
- **crypto.pbkdf2()**: Derives key using PBKDF2

### Stream
- **Readable**: Interface for readable streams
- **Writable**: Interface for writable streams
- **Duplex**: Interface for bidirectional streams
- **Transform**: Interface for transform streams
- **pipeline()**: Pipes streams with error handling
- **finished()**: Calls callback when stream finishes

### Child Process
- **child_process.spawn()**: Spawns new process with stream interface
- **child_process.exec()**: Spawns shell and executes command
- **child_process.execFile()**: Executes file directly
- **child_process.fork()**: Spawns Node.js process
- **child_process.execSync()**: Synchronous version of exec
- **child_process.spawnSync()**: Synchronous version of spawn

### Util
- **util.format()**: Returns formatted string using printf-style format
- **util.inspect()**: Returns string representation of object
- **util.isError()**: Checks if value is error
- **util.isDate()**: Checks if value is date
- **util.promisify()**: Converts callback-based function to promise-based
- **util.callbackify()**: Converts promise-based function to callback-based

### OS
- **os.platform()**: Returns platform identifier
- **os.arch()**: Returns CPU architecture
- **os.cpus()**: Returns array of CPU information
- **os.totalmem()**: Returns total system memory
- **os.freemem()**: Returns free system memory
- **os.homedir()**: Returns home directory path
- **os.tmpdir()**: Returns temporary directory path

---

## MongoDB/Mongoose

### Mongoose Schema Types
- **String**: String data type for text fields
- **Number**: Numeric data type for integers and floats
- **Date**: Date data type for timestamps
- **Boolean**: Boolean data type for true/false values
- **Array**: Array data type for lists of items
- **ObjectId**: MongoDB ObjectId data type for references
- **Mixed**: Mixed data type for flexible schemas
- **Buffer**: Binary data type for files and images

### Mongoose Validation
- **required**: Makes field mandatory
- **min/max**: Sets minimum/maximum numeric values
- **minlength/maxlength**: Sets minimum/maximum string length
- **match**: Validates against regex pattern
- **enum**: Validates against enum values
- **unique**: Ensures field uniqueness
- **validate**: Custom validation function

### Mongoose Methods
- **save()**: Saves document to database
- **create()**: Creates and saves new document
- **find()**: Finds documents matching query
- **findOne()**: Finds first document matching query
- **findById()**: Finds document by ID
- **updateOne()**: Updates first matching document
- **updateMany()**: Updates all matching documents
- **deleteOne()**: Deletes first matching document
- **deleteMany()**: Deletes all matching documents
- **countDocuments()**: Counts matching documents
- **aggregate()**: Performs aggregation pipeline

### Mongoose Static Methods
- **statics**: Adds methods to model
- **methods**: Adds methods to document instances
- **virtuals**: Creates computed properties
- **pre**: Runs before specified operation
- **post**: Runs after specified operation

### Mongoose Query Methods
- **where()**: Specifies query conditions
- **sort()**: Sorts query results
- **limit()**: Limits number of results
- **skip()**: Skips specified number of results
- **select()**: Specifies which fields to return
- **populate()**: Populates referenced documents
- **lean()**: Returns plain JavaScript objects

### Mongoose Middleware
- **pre('save')**: Runs before document save
- **post('save')**: Runs after document save
- **pre('remove')**: Runs before document removal
- **post('remove')**: Runs after document removal
- **pre('update')**: Runs before update operation
- **post('update')**: Runs after update operation

### Mongoose Schema Options
- **timestamps**: Automatically adds createdAt and updatedAt fields
- **versionKey**: Controls document versioning
- **collection**: Specifies collection name
- **strict**: Enforces strict schema validation
- **toJSON**: Customizes JSON serialization
- **toObject**: Customizes object serialization

---

## JavaScript ES6+ Features

### Arrow Functions
- **=>**: Arrow function syntax for concise function declarations
- **() => {}**: Parameterless arrow function
- **x => x**: Single parameter arrow function
- **(x, y) => x + y**: Multiple parameter arrow function

### Destructuring
- **[a, b] = arr**: Array destructuring assignment
- **{a, b} = obj**: Object destructuring assignment
- **{a: newName} = obj**: Destructuring with rename
- **{a, b, ...rest} = obj**: Destructuring with rest operator

### Template Literals
- **```**: Template literal syntax for multi-line strings
- **${}**: Expression interpolation in template literals
- **String.raw**: Raw string literal without escape processing

### Spread Operator
- **...array**: Spreads array elements
- **...object**: Spreads object properties
- **func(...args)**: Passes array as function arguments

### Rest Operator
- **(a, ...rest) => {}**: Collects remaining parameters
- **{a, ...rest} = obj**: Collects remaining object properties

### Classes
- **class**: ES6 class declaration syntax
- **constructor**: Class constructor method
- **extends**: Class inheritance keyword
- **super()**: Calls parent class constructor
- **static**: Static method declaration
- **get**: Getter method declaration
- **set**: Setter method declaration

### Promises
- **new Promise()**: Creates new promise
- **.then()**: Promise success handler
- **.catch()**: Promise error handler
- **.finally()**: Promise completion handler
- **Promise.all()**: Waits for all promises
- **Promise.race()**: Resolves with first promise
- **Promise.resolve()**: Creates resolved promise
- **Promise.reject()**: Creates rejected promise

### Async/Await
- **async**: Declares asynchronous function
- **await**: Waits for promise resolution
- **try/catch**: Error handling in async functions

---

## Common NPM Packages

### Development Tools
- **nodemon**: Auto-restarts Node.js applications on file changes
- **eslint**: JavaScript/React code linting and error checking
- **prettier**: Code formatter for consistent style
- **webpack**: Module bundler for modern JavaScript applications
- **vite**: Fast build tool and development server
- **babel**: JavaScript compiler for transpiling modern code

### Authentication & Security
- **bcryptjs**: Password hashing library
- **jsonwebtoken**: JWT token generation and verification
- **passport**: Authentication middleware for Node.js
- **helmet**: Security middleware for Express.js applications
- **cors**: Cross-Origin Resource Sharing middleware

### Data Handling
- **axios**: Promise-based HTTP client for API requests
- **joi**: Object schema validation library
- **multer**: Middleware for handling multipart/form-data
- **express-rate-limit**: Rate limiting middleware
- **joi**: Schema description and validation language

### Database
- **mongoose**: MongoDB object modeling for Node.js
- **mongodb**: Official MongoDB driver for Node.js
- **pg**: PostgreSQL client for Node.js
- **sequelize**: Promise-based ORM for Node.js

---

*This guide provides a comprehensive reference for MERN stack development. Each entry contains a one-line explanation to help developers quickly understand and implement these technologies.*


1. Root Files (The Foundation)
index.js
: The main entry point server file. It starts the app, connects to the database, and loads all your routes.
.env
: A hidden file where we store secret keys (like your database password and JWT secret) so they aren't public in the code.
seed.js
: A utility script we run once to fill your empty database with fake sample data (users, services, bookings) for testing.
verify_db.js
: A simpler helper script to just check if the database connection works and count how many items we have.
package.json
: The project's ID card; it lists all the installed libraries (dependencies) and startup scripts.
2. /models (The Blueprints)
These files define exactly what data we store for each item in MongoDB.

User.js
: Defines a user’s profile (name, email, password, role: Buyer/Seller/Admin).
Service.js
: Defines a service listing (title, description, price, category, seller ID).
Booking.js
: Defines a confirmed job (which user booked which service, the date, and status).
Review.js
: Defines a rating/comment left by a user for a specific service.
Category.js
: Defines the list of available job categories (e.g., "Plumbing", "Cleaning").
Dispute.js
: Defines a complaint filed by a user if something goes wrong with a booking.
Message.js
: Defines a single chat message sent between two users.
3. /routes (The Traffic Control)
These files define your API URLs (endpoints) and the logic for what happens when they are visited.

auth.js
: Handles login and registration (POST /api/auth/register, POST /api/auth/login).
services.js
: Handles creating, viewing, and searching for services (GET /api/services, POST /api/services).
bookings.js
: Handles booking a service and viewing your past/upcoming bookings.
reviews.js
: Handles adding a new review or fetching reviews for a service.
messages.js
: Handles sending a new message or getting the chat history with another user.
categories.js
: Handles listing all categories or adding new ones (mostly for admins).
admin.js
: A special route file for Admin-only actions like getting dashboard stats or managing users.
disputes.js
: Handles creating and resolving disputes between users.
users.js
: Handles fetching public user profiles or updating your own profile info.
4. /middleware (The Security Guards)
Functions that run before the main route logic to check permissions.

auth.js
: Checks if the request has a valid login token. If yes, it lets the request through; if no, it blocks it.
adminAuth.js
: A stricter guard that checks if the user is not just logged in, but specifically has the "admin" role.