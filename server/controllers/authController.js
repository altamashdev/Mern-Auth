import bcrypt from "bcryptjs"; //For Encrypt Password
import jwt from "jsonwebtoken"; //For create token for authentication for checking user exist
import userModel from "../models/userModel.js"; //Datadbase se connected Model
import transporter from "../config/nodemailer.js";
// import userAuth from "../middleware/userAuth.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";

// Function For Register user
export const register = async (req, res) => {
  // Frontend se details value lena
  const { name, email, password } = req.body;

  // If any fiels are empty or missing
  if (!name || !email || !password) {
    // Help of return Stop code and show error false and message
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    //if all is done try excute

    //for finding user in database
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      // if user was same or exist in database
      return res.json({ success: false, message: "User Already Exist" });
    }

    //if user was not exist 1st encrypt password by bcrypt method
    const hashedPassword = await bcrypt.hash(password, 10);

    // now create a user in database with hashed password
    const user = new userModel({ name, email, password: hashedPassword });

    //now user created
    await user.save();

    // Now Generating Token for showing user signing
    // there are we are using over own jwt also from env
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // now we add token variable in cookie and save in localstorage
    res.cookie("token", token, {
      httpOnly: true,
      // set site is secure in production and if developement means localhost show http not https its connect with env
      secure: true,

      // if code is on different domain it excute none and if localhost if excute strict
      sameSite: "none",
      domain: "mern-auth-livid-seven.vercel.app",
      // the expire date of cookie for local storage this is syntex
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Create a Function for Sending Welcom Email Before response by backend
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome To Sanjeet Water Supplier",
      text: `Welcome to Sanjeet Water Supplier Your Account has created with email id : ${email}`,
    };

    // Now Sending Email
    await transporter.sendMail(mailOptions);

    //After Sending Email the last one when also cookie save
    return res.json({ success: true, message: "Sign-Up SuccessFully " });
  } catch (error) {
    //If any error by backend like cache
    res.json({ success: false, message: error.message });
  }
};

// Function For Login
export const login = async (req, res) => {
  // find the value of frontend text
  const { email, password } = req.body;

  // 1st check email or password value jo ki upper frontend se li he
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email & Password Are Required",
    });
  }

  // Now try catch for extra security
  try {
    // after checking value is not empty we are Matching email on database
    const user = await userModel.findOne({ email }); //database me email searching

    // if email is not exist excute 1st if statement
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    // if email exist match password with these email
    // Now matching password from database or from frontend value
    const isMatch = await bcrypt.compare(password, user.password);

    // if password not matched
    if (!isMatch) {
      return res.json({ success: false, message: "Invalide Password" });
    }

    // Now if all levels compelte means email and password exist generate token for remember user for security purpose
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // now we add token variable in cookie and save in localstorage
    res.cookie("token", token, {
      httpOnly: true,
      // set site is secure in production and if developement means localhost show http not https its connect with env
      secure: true,

      // if code is on different domain it excute none and if localhost if excute strict
      sameSite: "none",

      domain: "mern-auth-livid-seven.vercel.app",

      // the expire date of cookie for local storage this is syntex
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // the last one when also cookie save

    return res.json({ success: true, message: "Login SuccessFully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Function for LogOut
// for logout function we simply remove the cookie from storage
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      // set site is secure in production and if developement means localhost show http not https its connect with env
      secure: true,
      // if code is on different domain it excute none and if localhost if excute strict
      sameSite: "none",
      domain: "mern-auth-livid-seven.vercel.app",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Function for Sending email varification Code
export const sendVarifyOtp = async (req, res) => {
  // Try Catch for any error
  try {
    // userid ui se lena he
    const userId = req.userId;

    // ui se li userId ko database wali uniqe id se match karna he
    const user = await userModel.findById(userId);

    // ab if condition taki if the user account already variefied , so send error and code stop and not send otp
    if (user.isAccountVarified) {
      console.log("is account");
      return res.json({
        success: false,
        message: "Account Already Variefied",
      });
    } else {
      if (user.varifyOtp === "") {
        /*
    If user account not varify otp generate and send
     
    🔍 Step by step:
     Math.random() → random number between 0 and 1 (like 0.54321).
     Math.random() * 900000 → random number between 0 and 900000.
     100000 + ... → ensures minimum value 100000,
     so final range = 100000 → 999999 (6 digits).
     Math.floor() → removes decimal part, gives an integer (e.g. 527394).
     String(...) → converts that number into a string (so "527394").
     Useful if you want to send it in emails/SMS where leading zeroes matter.
     ✅ So output = "6-digit OTP as a string" */
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.varifyOtp = otp; // store otp in database before sending
        user.varifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // otp expire automatic dynamic with this time line

        // now save all upper details
        await user.save();
        console.log("USer save");

        // After save user detailse of otp or expire time we send this otp user by mail with nodemailer
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: user.email,
          subject: "Account Varification Otp",
          html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
            "{{email}}",
            user.email
          ),
        };

        // Now Sending Email For varifieng account

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: "OTP sent" });
      } else {
        return res.json({ success: false, message: "OTP Already Sent" });
      }
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//
export const varifyEmail = async (req, res) => {
  // userid ui se or also value jo user dal ra he otp ke liye
  const { otp } = req.body;
  const userId = req.userId;
  // agar userId ya otp nhi ho or submit karna chahe to error show ho or code stop ho jaye
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    //it's first find user from database using userModel
    const user = await userModel.findById(userId);

    //sabse pehle check karenge ki user database me he ya nhi
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    //agar user he to database me ye condition check karenge
    if (user.varifyOtp === "" || user.varifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    //iske baad khi OTP expire to nhi checking
    if (user.varifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    //All Condition done than show user varified
    user.isAccountVarified = true;
    // Also reset this key in database
    user.varifyOtp = "";
    user.varifyOtpExpireAt = 0;

    //Now Save the data
    await user.save();

    // after save data in database give response to success email varified
    return res.json({ success: true, message: "Email Varified Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//isAuthenticated Function For sea and show user is already login or not
//its help us to show any user profile or login option
export const isAuthenticated = async (req, res) => {
  // 1st try catch for any catch or server issue
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error from isAuthenticated",
    });
  }
};

// Sending OTP for reseting Password
export const sendResetOtp = async (req, res) => {
  // Getting email from user ui input field
  const { email } = req.body;

  // if user input field is empty so excute this
  if (!email) {
    return res.json({
      success: false,
      message: "Email is Required",
    });
  }

  // Now if email it available than excute this try-catch statement-:
  try {
    // Now finding user in database with help of email
    const user = await userModel.findOne({ email });

    // now check
    if (!user) {
      return res.json({ success: false, message: "User no found" });
    }

    if (user.resetOtp !== "") {
      return res.json({
        success: false,
        message: "Otp Send Already Check Email!",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp; // store otp in database before sending
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // otp expire automatic dynamic with this time line

    // now save all upper details
    await user.save();

    // After save user detailse of otp or expire time we send this otp user by mail with nodemailer
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    // Now Sending Email For varifieng account
    await transporter.sendMail(mailOptions);
    console.log("Mail sent");

    // Don's Forget it in any code of this type
    return res.json({ success: true, message: "OTP Sent to your email" }); //the final line
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify OTP for Reset Your password
export const resetPassword = async (req, res) => {
  // user ke ui se email,otp,newPassword ki value lena
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    // 1st check input fields are not empty
    return res.json({
      success: false,
      message: "Email , OTP and New Password are required",
    });
  }

  try {
    //now try catch for any server issues or any bug

    //findign user from database from the value of input fields of user ui
    const user = await userModel.findOne({ email });

    //now one by one condition check
    if (!user) {
      //checking user is available or not in database
      return res.json({ success: false, message: "User not found" });
    }

    //now checking  in database resetOtp is empty or otp value is same as user input value
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalide OTP" });
    }

    //now checking user OTP expired or not
    if (user.resetOtpExpireAt < Date.now()) {
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;
      await user.save();
      return res.json({ success: false, message: "OTP has Expired" });
    }

    // Password Secured By Hashed Before Store in Database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //Now store all details in database
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    //now saving all details which we store up
    await user.save();

    //now all is done than response send to user ui
    return res.json({
      success: true,
      message: "Password has been reset Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
