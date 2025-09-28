import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../../helpers";
import {
  signUp,
  confirmSignUp,
  signIn,
  fetchAuthSession,
  signOut,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  autoSignIn,
} from "aws-amplify/auth";

import {
  isLoggedIn
} from  ""