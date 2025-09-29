import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { create } from 'zustand';
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
  autoSignIn,
} from "aws-amplify/auth";



export const useAuthStore = create((set, get) => ({

  status: 'checking',
  user: null,
  message: undefined,
  isLoading: false,

  checkAuthToken: async () => {
    set({ status: 'checking' });
    try {
      const { tokens } = await fetchAuthSession();
      if (!tokens) throw new Error('No session');

      const idToken = tokens.idToken.toString();
      localStorage.setItem('token', idToken);

      const userPayload = tokens.idToken.payload;
      const userData = {
        id: userPayload.sub,
        email: userPayload.email,

      };

      set({ status: 'authenticated', user: userData, isLoading: false, message: undefined });
    } catch (error) {
      localStorage.removeItem('token');
      set({ status: 'not-authenticated', user: null, message: error?.message });
    }
  },

  startRegister: async (formData, navigate) => {
    set({ isLoading: true, message: undefined });
    const { password, confirm, email, fullName } = formData;
    console.log(formData);
    if (password !== confirm) {
      set({ isLoading: false, message: "Las claves no son iguales" });
      return;
    }

    try {
      const { userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email: email,
            name
          },
          autoSignIn: true
        }
      });

      console.log("✅ Registro exitoso:", { userId, nextStep });

      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        const tempUser = { email, name: fullName, id: userId };
        set({
          user: tempUser,
          status: "not-authenticated",
          isLoading: false,
          message: "Revisa tu correo para confirmar tu cuenta."
        });
        navigate("/Verificar");
      } else {
        set({ isLoading: false, message: "Usuario registrado correctamente." });
      }
    } catch (error) {
      console.error("❌ Error en registro:", error);

      let message = "Error inesperado en el registro.";
      if (error.name === "UsernameExistsException") {
        message = "El correo ya está registrado.";
      } else if (error.name === "InvalidPasswordException") {
        message = "La contraseña no cumple los requisitos de seguridad.";
      } else if (error.name === "InvalidParameterException") {
        message = "Revisa los campos ingresados.";
      }

      set({ isLoading: false, message });
    }
  },

  startConfirmCode: async ({ code }, navigate) => {
    set({ isLoading: true, message: undefined });
    const { user } = get();

    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: user.email,
        confirmationCode: code,
      });

      if (isSignUpComplete && (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN' || nextStep.signUpStep === 'DONE')) {
        set({ isLoading: false, status: 'authenticated' });
        navigate('/');
      } else {
        set({ isLoading: false, message: 'Error al confirmar el código.' });
      }
    } catch (error) {
      set({ isLoading: false, message: error.message });
    }
  },

  startLogin: async ({ email, password }, navigate) => {
    set({ isLoading: true, message: undefined });
    try {
      console.log(email, password);
      await signOut();
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      console.log(isSignedIn, nextStep);
      if (isSignedIn && nextStep.signInStep === 'DONE') {
        const token =await get().checkAuthToken();
        console.log(token);
        navigate('/Home');
      } else if (!isSignedIn && nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        set({ user: { email } });
        await resendSignUpCode({ username: email });
        navigate('/Verificar');
      }
      else {
        set({ isLoading: false, message: 'Error al iniciar sesión.' });
      }
    } catch (error) {
      set({ isLoading: false, message: error.message });
    }
  },

  startLogout: async () => {
    set({ status: 'checking' });
    try {
      await signOut();
      localStorage.removeItem('token');
      set({ status: 'not-authenticated', user: null, message: undefined });
    } catch (error) {
      console.log('error signing out: ', error);
      set({ status: 'authenticated' });
    }
  },

  startAutoLogin: async () => {
    try {
      const { isSignedIn, nextStep } = await autoSignIn();
      if (isSignedIn && nextStep.signInStep === 'DONE') {
        await get().checkAuthToken();
      }
    } catch (error) {
      set({ status: 'not-authenticated', user: null, message: error?.message });
    }
  },

  startResetPassword: async ({ email }, navigate) => {
    set({ isLoading: true, message: undefined });
    try {
      const { nextStep } = await resetPassword({ username: email });
      if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        set({ user: { email }, isLoading: false });
        navigate('/reset_password');
      }
    } catch (error) {
      set({ isLoading: false, message: error.message });
    }
  },

  startConfirmResetPassword: async ({ password, confirmPassword }, navigate) => {
    set({ isLoading: true, message: undefined });
    const { user, code } = get();

    if (password !== confirmPassword) {
      return set({ isLoading: false, message: 'Las contraseñas no coinciden' });
    }


    try {
      await confirmResetPassword({
        username: user.email,
        confirmationCode: 'CÓDIGO_DEL_FORMULARIO',
        newPassword: password,
      });
      set({ isLoading: false, message: 'Ya puedes ingresar con tus credenciales', status: 'not-authenticated' });
      navigate('/success_mesage');
    } catch (error) {
      set({ isLoading: false, message: error.message });
    }
  },

}));