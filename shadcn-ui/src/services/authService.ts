import { 
  auth, 
  googleProvider, 
  setupRecaptcha,
  signInWithPhoneNumber as firebaseSignInWithPhoneNumber
} from '@/config/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  ConfirmationResult
} from 'firebase/auth';
import { User } from '@/types';

export class AuthService {
  private static instance: AuthService;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Email/Password Authentication
  async signInWithEmail(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.mapFirebaseUserToUser(userCredential.user);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string, userData: Partial<User>): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = this.mapFirebaseUserToUser(userCredential.user);
      
      // In a real app, save additional user data to Firestore
      console.log('User created:', user, 'Additional data:', userData);
      
      return user;
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  }

  // Google Authentication
  async signInWithGoogle(): Promise<User | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return this.mapFirebaseUserToUser(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  // Phone Authentication
  async initializePhoneAuth(containerId: string): Promise<void> {
    try {
      this.recaptchaVerifier = setupRecaptcha(containerId);
    } catch (error) {
      console.error('Error initializing phone auth:', error);
      throw error;
    }
  }

  async sendVerificationCode(phoneNumber: string): Promise<ConfirmationResult> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      // Format phone number for international format
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+972${phoneNumber.substring(1)}`;
      
      const confirmationResult = await firebaseSignInWithPhoneNumber(
        auth,
        formattedPhone,
        this.recaptchaVerifier
      );
      
      return confirmationResult;
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  }

  async verifyCode(confirmationResult: ConfirmationResult, code: string): Promise<User | null> {
    try {
      const userCredential = await confirmationResult.confirm(code);
      return this.mapFirebaseUserToUser(userCredential.user);
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Auth State Observer
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      const user = firebaseUser ? this.mapFirebaseUserToUser(firebaseUser) : null;
      callback(user);
    });
  }

  // Get Current User
  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    return firebaseUser ? this.mapFirebaseUserToUser(firebaseUser) : null;
  }

  // Helper method to map Firebase User to our User interface
  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'משתמש',
      phone: firebaseUser.phoneNumber || '',
      email: firebaseUser.email || undefined,
      city: '', // Will be set during profile completion
      address: '', // Will be set during profile completion
      verified: firebaseUser.emailVerified,
      rating: 5.0,
      joinDate: new Date(),
      isCollector: false,
      notificationSettings: {
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: false,
        newRequests: true,
        priceUpdates: true,
        statusUpdates: true,
        communityNews: false
      }
    };
  }

  // Clean up reCAPTCHA
  cleanup(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }
}

export default AuthService;