export interface SignUpFormData {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    repassword: string;
    isGpsEnabled: boolean;
    gender: 'male' | 'female';
    sexual_orientation: 'heterosexual' | 'homosexual' | 'bisexual';
    eria: string;
  }
  
  export const initialSignUpFormData: SignUpFormData = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    repassword: '',
    isGpsEnabled: false,
    gender: 'male',
    sexual_orientation: 'heterosexual',
    eria: '',
  };