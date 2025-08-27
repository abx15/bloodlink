# 🩸 Bloodlink - Blood Donation & Blood Bank Management System  

Bloodlink is a web-based application designed to connect **blood donors, recipients, and blood banks**.  
The aim of this project is to make the blood donation process **faster, reliable, and accessible** for everyone in need.  

---

## 🚀 Features  

- 👤 **User Roles**: Donor, Recipient, and Admin modules  
- 🔍 **Search Blood Groups**: Find available donors quickly  
- 🏥 **Blood Bank Management**: Add, update, and monitor blood stock  
- 📅 **Request / Donate Blood**: Easy request and donation system  
- 🔔 **Notifications & Alerts** for urgent blood requirements  
- 📊 **Admin Dashboard** for managing users and requests  
- 🔐 **Secure Login & Registration** system  
- 🌐 **Responsive UI** (works on desktop & mobile)  

---

## 🛠️ Installation & Setup  

### Prerequisites  
- Web server: Apache/Nginx (XAMPP or WAMP recommended)  
- PHP: 7.4 or higher  
- MySQL: 5.7 or higher  
- Code editor: VS Code  

### Step 1: Download & Extract  
```bash
# Clone the repository
git clone https://github.com/abx15/bloodlink.git

# Go to project folder
cd bloodlink

```

### Step 2: Database Setup

- Open phpMyAdmin

- Create a new database named bloodlink_db

- Import the bloodlink.sql file provided in the project

### Step 3: Configure Database Connection

- Edit includes/db.

```php
$servername = "localhost";
$username   = "your_mysql_username";   // Change this
$password   = "your_mysql_password";   // Change this
$dbname     = "bloodlink_db";
```
### Step 4: Start Server

- Place the project in htdocs/ (XAMPP) or www/ (WAMP)

- Start Apache and MySQL services

- Open in browser:
``` arduino
http://localhost/bloodlink
```

## 🎯 Usage Guide

- Donor → Register & update availability, donate blood

- Recipient → Search donors & request blood

- Admin → Manage users, requests & blood stock

- Dashboard → View statistics & reports

## 🔧 Configuration Options

- Update email/SMS API keys (if integrated) in config.php

- Change UI theme using assets/css/style.css

- Customize alerts & notifications in includes/functions.php

# 🚨 Troubleshooting
###  Common Issues

#### Database Connection Error

- Check credentials in includes/db.php

- Ensure MySQL service is running

#### CSS/JS Not Loading

- Verify project folder inside htdocs/

- Check file paths in header.php

#### Login Not Working

- Ensure users table exists in database

- Verify session is enabled in php.ini

## Debug Mode

- Enable error reporting by adding at top of PHP files:

```php
 error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 🔒 Security Considerations

- ✅ Use Prepared Statements to prevent SQL injection

- ✅ Sanitize all user inputs before storing in database

- ✅ Hide sensitive credentials (use .env files in production)

- ✅ Disable error display on live server

## 🎨 Customization

- Theme: Modify - assets/css/style.css for custom colors/fonts

- UI Layout: Update includes/header.php & footer.php

- Database: Add extra fields (like donor age, location, etc.) for better matching

## 📂 Project Structure

```pgsql
Bloodlink/
│── assets/        # CSS, JS, Images
│── includes/      # Header, Footer, Database connection
│── admin/         # Admin panel files
│── donor/         # Donor dashboard
│── recipient/     # Recipient dashboard
│── index.php      # Homepage
│── login.php      # Login system
│── register.php   # Registration system
│── bloodlink.sql  # Database file
```

## 🤝 Contributing

- Fork the repository

- Create a feature branch (feature-new)

- Commit your changes (git commit -m "Added new feature")

- Push to branch (git push origin feature-new)

- Open a Pull Request

# 📜 License

- This project is open source and available under the MIT License.

# 🚀 Future Enhancements

- 📱 Mobile app integration (Android/iOS)

- 📡 SMS & Email Alerts for urgent requests

- 🧠 AI-based donor-recipient matching

- 📊 Advanced reporting & analytics

- 🌍 Multi-language support
# Made with ❤️ to save lives through technology.


---

## 📄 LICENSE (MIT)  

```text
MIT License

Copyright (c) 2025 Bloodlink

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
