export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  availability: string[];
  education: string;
  experience: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppRoute {
  HOME = '/',
  ABOUT = '/about',
  SERVICES = '/services',
  DOCTORS = '/doctors',
  APPOINTMENT = '/appointment',
  CONTACT = '/contact',
}
