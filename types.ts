
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

export interface Attachment {
  type: 'image' | 'video' | 'audio';
  data: string; // base64
  mimeType: string;
  previewUrl: string; // for UI display
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  attachments?: Attachment[];
  groundingMetadata?: {
    groundingChunks?: Array<{
      web?: { uri: string; title: string };
      maps?: { uri: string; title: string; placeAnswerSources?: any[] };
    }>;
  };
}

export interface ChatSettings {
  model: 'pro' | 'flash' | 'flash-lite';
  enableThinking: boolean;
  enableSearch: boolean;
  enableMaps: boolean;
  enableAudioResponse: boolean;
}

export interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  type: 'Checkup' | 'Emergency' | 'Surgery' | 'Consultation';
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  status: 'Active' | 'Completed';
}

export enum AppRoute {
  HOME = '/',
  ABOUT = '/about',
  SERVICES = '/services',
  DOCTORS = '/doctors',
  APPOINTMENT = '/appointment',
  CONTACT = '/contact',
  AI_HUB = '/ai-hub',
  HISTORY = '/history',
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';
