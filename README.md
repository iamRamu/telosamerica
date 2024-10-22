# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# User Authentication and Profile Management - README

This project provides a comprehensive user authentication and profile management system. It includes components for user registration, OTP verification, password management, login functionality, and user account settings. Below is the breakdown of components and their functionality.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Components Overview](#components-overview)
  - [Registration](#registration)
  - [Verify OTP](#verify-otp)
  - [Set Password](#set-password)
  - [Login](#login)
  - [Forget Password](#forget-password)
  - [Change Password](#change-password)
  - [Home Page](#home-page)
  - [Header](#header)
  - [Sidebar](#sidebar)
  - [My Account](#my-account)
    - [Edit Profile](#edit-profile)
    - [Change Password](#change-password)

---

## Getting Started

To get started with the project, clone this repository and follow the installation steps provided below.

### Prerequisites

- Node.js and npm installed on your system.
- Basic knowledge of React.js.

---

## Environment Variables

Ensure that you set up the following environment variables for your API calls:

- `VITE_BASE_URL` – Base URL of your API server.
- `VITE_REGISTER` – Endpoint for user registration.
- `VITE_VERIFY_OTP` – Endpoint for OTP verification.
- `VITE_SET_PASSWORD` – Endpoint for setting a new password.
- `VITE_LOGIN` – Endpoint for user login.
- `VITE_SEND_OTP` – Endpoint for sending OTP (for Forget Password).
- `VITE_CHANGE_PASSWORD` – Endpoint for changing user password.

Add these environment variables to your `.env` file.

---

## Components Overview

### Registration

#### Overview
The **Registration** component allows users to register using their email and other relevant details. Upon successful registration, the backend will send an OTP to the user's email for verification.

#### Features
- User can input email and other required details.
- On successful registration, redirects to the OTP verification page.
- Makes a POST request to the registration API.

#### Important Files
- **Component**: `src/components/Registration/index.js`
- **Styles**: `src/components/Registration/index.css`

#### API Call
- **Endpoint**: `${VITE_BASE_URL}/register`
- **Method**: `POST`

---

### Verify OTP

#### Overview
The **VerifyOtp** component is used to verify the OTP sent to the user's email after registration. Users need to input the 4-digit OTP received.

#### Features
- Supports automatic focus shift between OTP fields.
- Includes copy-paste functionality for OTP.
- On successful OTP verification, the user is redirected to the Set Password page.

#### Important Files
- **Component**: `src/components/VerifyOtp/index.js`
- **Styles**: `src/components/VerifyOtp/index.css`

#### API Call
- **Endpoint**: `${VITE_BASE_URL}/verifyOTP`
- **Method**: `POST`

---

### Set Password

#### Overview
The **SetPassword** component allows users to create a new password after OTP verification. It validates the password to ensure it meets complexity requirements (e.g., uppercase, lowercase, special characters, etc.).

#### Features
- Includes password visibility toggle (show/hide password).
- Validates password strength (at least 8 characters, uppercase, lowercase, digit, and special character).
- On successful password submission, the user is automatically logged in.

#### Important Files
- **Component**: `src/components/SetPassword/index.js`
- **Styles**: `src/components/SetPassword/index.css`

#### API Call
- **Endpoint**: `${VITE_BASE_URL}/setpassword`
- **Method**: `POST`

---

### Login

#### Overview
The **LoginPage** component allows existing users to log in using their email and password. It manages authentication tokens via cookies and redirects users to the home page upon successful login.

#### Features
- Accepts email and password inputs.
- Handles authentication via JWT tokens stored in cookies.
- Redirects logged-in users to the home page if already authenticated.

#### Important Files
- **Component**: `src/components/LoginPage/index.js`
- **Styles**: `src/components/LoginPage/index.css`

#### API Call
- **Endpoint**: `${VITE_BASE_URL}/login`
- **Method**: `POST`

---

### Forget Password

#### Overview
The **ForgetPassword** component allows users to initiate the password recovery process by requesting an OTP via their registered email.

#### Features
- Users input their registered email to request a password reset OTP.
- Sends a request to the server to initiate the password reset process.
- Handles form validation using **Formik** and **Yup**.

#### Important Files
- **Component**: `src/components/ForgetPassword/index.js`
- **Styles**: `src/components/ForgetPassword/index.css`

#### API Call
- **Endpoint**: `${VITE_BASE_URL}/sendotp`
- **Method**: `POST`

---

### Change Password

#### Overview
The **ChangePassword** component allows authenticated users to change their existing password while logged in. This component is accessible from the **MyAccount** section after login.

#### Features
- Users input the old password, new password, and confirm the new password.
- Includes form validation and error handling for password mismatch and other validation rules.

#### Important Files
- **Component**: `src/components/ChangePassword/index.js`
- **Styles**: `src/components/ChangePassword/index.css`

#### API Call
- **Endpoint**: `${VITE_BASE_URL}/changepassword`
- **Method**: `POST`

---

### Home Page

#### Overview
The **HomePage** component is the main landing page after a successful login. It contains the **Header** and **Sidebar** components for navigation.

#### Features
- Displays personalized content for the authenticated user.
- Allows navigation through the app via **Sidebar**.

#### Important Files
- **Component**: `src/components/HomePage/index.js`
- **Styles**: `src/components/HomePage/index.css`

---

### Header

#### Overview
The **Header** component contains a navigation bar with the logged-in user's name. It also includes a dropdown menu accessible via an arrow-down icon.

#### Features
- Displays a dropdown with **MyAccount** and **Logout** options.
- Clicking **MyAccount** navigates to the account management page.
- Clicking **Logout** logs the user out and clears their session.

#### Important Files
- **Component**: `src/components/Header/index.js`
- **Styles**: `src/components/Header/index.css`

---

### Sidebar

#### Overview
The **Sidebar** component provides links for navigation between different pages like Dashboard, Courses, and more.

#### Features
- Highlights the active route.
- Collapsible and responsive design.

#### Important Files
- **Component**: `src/components/Sidebar/index.js`
- **Styles**: `src/components/Sidebar/index.css`

---

### My Account

#### Overview
The **MyAccount** component allows users to manage their profile details, including changing their profile picture and password. It contains two sections: **Edit Profile** and **Change Password**.

#### Important Files
- **Component**: `src/components/MyAccount/index.js`
- **Styles**: `src/components/MyAccount/index.css`

---

#### Edit Profile

#### Overview
The **EditProfile** section allows users to update their profile information and change their profile picture.

#### Features
- Users can preview the profile picture before uploading.
- Users can update personal details like name, email, etc.

#### Important Files
- **Component**: `src/components/MyAccount/EditProfile.js`
- **Styles**: `src/components/MyAccount/EditProfile.css`

---

#### Change Password (within MyAccount)

#### Overview
The **ChangePassword** section within **MyAccount** allows users to update their password.

#### Features
- Users can enter their current password, new password, and confirm the new password.
- Includes validation for password rules and confirmation match.

#### Important Files
- **Component**: `src/components/MyAccount/ChangePassword.js`
- **Styles**: `src/components/MyAccount/ChangePassword.css`


