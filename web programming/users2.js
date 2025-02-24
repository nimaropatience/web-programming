

const fs = require('fs');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const USERS_FILE = 'users.json';

// Load users from the JSON file
function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        return {};
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
}

// Save users to the JSON file
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Registering a new user
function register() {
    rl.question("Enter your name: ", (name) => {
        console.log(`Welcome, ${name}!`);
        rl.question("Enter your email: ", (email) => {
            rl.question("Enter your password: ", (password) => {
                const users = loadUsers();

                // Check if the user already exists
                if (users[email]) {
                    console.log(' This user already exists!');
                    mainMenu();
                } else {
                    const hashedPassword = bcrypt.hashSync(password, 10);
                    users[email] = { name, email, password: hashedPassword };
                    saveUsers(users);
                    console.log(' Your Registration has been successful!');
                    mainMenu();
                }
            });
        });
    });
}

// Login an existing user
function login() {
    rl.question("Enter your email: ", (email) => {
        rl.question("Enter your password: ", (password) => {
            const users = loadUsers();

            const user = users[email];
            if (user && bcrypt.compareSync(password, user.password)) {
                console.log(`Welcome back, ${user.name}!`);
                showMenu(user); // Shows the menu after  a successful login
            } else {
                console.log('type correct email or password');
                mainMenu();
            }
        });
    });
}

// Displays user menu after login
const showMenu = (user) => {
    console.log(`
   Welcome, ${user.name}!
    1. View Profile
    2. Logout
    3. Exit
    `);
    rl.question('Select an option: ', (option) => {
        switch (option) {
            case '1':
                console.log(`\nProfile Details:`);
                console.log(`Username: ${user.name}`);
                console.log(`Email: ${user.email}\n`);
                showMenu(user); // Shows the menu again after displaying the profile
                break;
            case '2':
                console.log('Logged out.');
                mainMenu();  // Goes  back to the main menu (either Register or Login)
                break;
            case '3':
                console.log('Until next time');
                rl.close(); // Exits the application
                process.exit();
                break;
            default:
                console.log('Invalid option  try again.');
                showMenu(user); 
                break;
        }
    });
};

// Main menu
function mainMenu() {
    console.log(`
    1. Register
    2. Login
    3. Exit
    `);
    rl.question('Select an option: ', (option) => {
        switch (option) {
            case '1':
                register();
                break;
            case '2':
                login();
                break;
            case '3':
                console.log('Until next time');
                rl.close();
                process.exit();
                break;
            default:
                console.log('Invalid option try again.');
                mainMenu();
                break;
        }
    });
}

// Starts the main menu
mainMenu();
