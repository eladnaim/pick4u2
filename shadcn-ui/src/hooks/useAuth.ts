import { useState, useEffect } from 'react';
import { User } from '@/types';
import AuthService from '@/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authService = AuthService.getInstance();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.signInWithEmail(email, password);
      setUser(user);
      return user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.signUpWithEmail(email, password, userData);
      setUser(user);
      return user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.signInWithGoogle();
      setUser(user);
      return user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      setUser(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async (phoneNumber: string) => {
    try {
      setError(null);
      await authService.initializePhoneAuth('recaptcha-container');
      return await authService.sendVerificationCode(phoneNumber);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const verifyCode = async (confirmationResult: any, code: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.verifyCode(confirmationResult, code);
      setUser(user);
      return user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendVerificationCode,
    verifyCode,
    setUser
  };
};

export default useAuth;