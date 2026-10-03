# DevTinder

 - Create a Vite+React app
 - Remove uneccesary code and create a Hello World app
 - Install Tailwind CSS
 - Install DaisyUI
 - Add Navbar component to App.jsx
 - Create a NavBar.jsx separate Component file
 - Install react router dom
 - Create BrowserRouter > Routes > Route=/ Body > RouteChildren
 - Create an Outlet in your Body Component
 - Create a footer
 - Create a Login Page
 - Install axios
 - CORS - install cors in backend => add middleware to with configurations: orgin, credentials: true
 - Whenever you're making API call so pass axios => { withCredentials: true }
 - install react-redux + @reduxjs/toolkit - https://redux-toolkit.js.org/tutorials/quick-start
 - configureStore => Provider => createSlice => add reducer to store
 - Add redux devtools in chrome
 - Login and see if your data is coming properly in the store
 - NavBar should update as soon as user logs in
 - Refactor our code to add constants file + create a components folder 

 - If token is not present, redirect user to login page
 - Logout Feature
 - Get the feed and add the feed in the store
 - build the user card on feed
 - Edit Profile Feature
 - Show Toast Message on save of profile

 - New Page - See all my connections
 - New Page - See all my Conenction REquests
 - Feature - Accept/Reject connection request
 - Send/Ignore the user card from the feed 
 - Signup New User 
 - E2E testing



Body 
    NavBar
    Route=/  => Feed
    Route=/login  => Login
    Route=/connetions => Connections
    Router=/profile => Profile


Need to do error handling in component, globally, and using toastr





# Deployment

    - Signup on AWS 
    - Launch instance
    - chmod 400 <secret>.pem
    - ssh -i "devTinder-secret.pem" ubuntu@ec2-43-204-96-49.ap-south-1.compute.amazonaws.com
    - Install Node version 16.17.0
    - Git clone
    - Frontend    
        - npm install  -> dependencies install
        - npm run build
        - sudo apt update
        - sudo apt install nginx
        - sudo systemctl start nginx
        - sudo systemctl enable nginx
        - Copy code from dist(build files) to /var/www/html/
        - sudo scp -r dist/* /var/www/html/
        - Enable port :80 on your instance (by adding security -> inbound rule as custom tcp with port 80 and 0.0.0.0)
    - Backend
        - allowed ec2 instance public IP on mongodb server
        - npm intsall pm2 -g
        - pm2 start npm --name "dt-be" -- start
        - pm2 list, pm2 stop <name>, pm2 delete <name>
        - pm2 logs, pm2 flush
        - config nginx proxy pass - sudo nano /etc/nginx/sites-available/default (for proper routing/differentiate between app routes and api routes)
        - restart nginx - sudo systemctl restart nginx



# Handle CORS
    - Set allowed origins in BE



# Nginx config: 

    - sudo nano /etc/nginx/sites-available/default (to edit nginx configuration file)
    - sudo nginx -t (to check syntax error in config file)
    - sudo systemctl reload nginx (to reload the nginx)

    #Frontend = http://54.252.117.220/
    #Backend = http://54.252.117.220:7777/

    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;
        index index.html index.htm;

        server_name devtinder.dishantbisht.in;

        # React Front-end Routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Node.js Back-end API Proxy
        location /api/ {
            proxy_pass http://localhost:7777;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'keep-alive';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }



# Adding a custom Domain name

    - purchased domain name from godaddy
    - signup on cloudflare & add a new domain name
    - change the nameservers on godaddy and point it to cloudflare
    - wait for sometime till your nameservers are updated ~15 minutes
    - DNS record: A devtinder.dishantbisht.in 54.252.117.220 [every record should be DNS Only as SSL is maintained by certbot]



# Enable SSL for website
    # Install Certbot and the Nginx plugin (to install SSL Certificate)
        - sudo apt update
        - sudo apt install certbot python3-certbot-nginx -y

    # Obtain the SSL certificate and auto-configure Nginx
        - sudo certbot --nginx -d devtinder.dishantbisht.in



# Sending Emails via SES

    - Create a IAM user
    - Give Access to AmazonSESFullAccess / AdministratorAccess
    - Amazon SES: Create an Identity
    - Verify your domain name
    - Verify an email address identity
    - Install AWS SDK - v3 
    - Code Example https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses#code-examples
    - Setup SesClient
    - Access Credentials should be created in IAm under SecurityCredentials Tab
    - Add the credentials to the env file
    - Write code for SESClient
    - Write code for Sending email address
    - Make the email dynamic by passing more params to the run function



# Install pm2 (advanced production process manager for Node.js)
    - npm install pm2@latest -g
    - pm2 start npm --name "dt-be" -- run start
    - pm2 list
    - pm2 logs
    - pm2 restart dt-be (pm2 restart all -i max)
    - pm2 flush dt-be
    - pm2 stop dt-be
    - pm2 delete dt-be
    - pm2 status



# CI/CD Deployment using GitHub Actions
    
    - Create .github/workflows directories in root
    - Then create deploy-fe.yml and deploy-be.yml
    - Set Secrets variables (like VITE_BASE_URL, VITE_GOOGLE_CLIENT_ID, EC2_HOST, EC2_USERNAME, EC2_SSH_KEY) in github repo settings




// For dishantbisht.in
# Deployment using S3 

    - Create a S3 Bucket
    I have purchased my own domain dishantbisht.in (its cname is my s3 bucket) since its holding my portfolio site.
