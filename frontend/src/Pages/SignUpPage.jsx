// src/Pages/SignUp.js
import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />;
};

export default SignUpPage;