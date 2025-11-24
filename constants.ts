import { Doctor, Service } from './types';

export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    image: 'https://picsum.photos/id/64/300/300',
    availability: ['Mon', 'Wed', 'Fri'],
    education: 'MD, Johns Hopkins University',
    experience: 15
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    image: 'https://picsum.photos/id/91/300/300',
    availability: ['Tue', 'Thu'],
    education: 'MD, Stanford University',
    experience: 12
  },
  {
    id: '3',
    name: 'Dr. Emily Al-Fayed',
    specialty: 'Pediatrics',
    image: 'https://picsum.photos/id/342/300/300',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    education: 'MD, Harvard Medical School',
    experience: 8
  },
  {
    id: '4',
    name: 'Dr. Robert Stone',
    specialty: 'Orthopedics',
    image: 'https://picsum.photos/id/1005/300/300',
    availability: ['Mon', 'Thu'],
    education: 'MD, Mayo Clinic Alix School of Medicine',
    experience: 20
  }
];

export const SERVICES: Service[] = [
  {
    id: 'cardiology',
    title: 'Cardiology',
    description: 'Comprehensive heart care ranging from prevention to complex surgeries.',
    icon: 'Heart',
    image: 'https://picsum.photos/id/400/800/600'
  },
  {
    id: 'neurology',
    title: 'Neurology',
    description: 'Advanced diagnosis and treatment for disorders of the nervous system.',
    icon: 'Brain',
    image: 'https://picsum.photos/id/500/800/600'
  },
  {
    id: 'pediatrics',
    title: 'Pediatrics',
    description: 'Compassionate care for infants, children, and adolescents.',
    icon: 'Baby',
    image: 'https://picsum.photos/id/600/800/600'
  },
  {
    id: 'emergency',
    title: 'Emergency Care',
    description: '24/7 rapid response for critical medical situations.',
    icon: 'Ambulance',
    image: 'https://picsum.photos/id/700/800/600'
  },
  {
    id: 'orthopedics',
    title: 'Orthopedics',
    description: 'Treatment for bone, joint, ligament, and muscle conditions.',
    icon: 'Bone',
    image: 'https://picsum.photos/id/800/800/600'
  },
  {
    id: 'radiology',
    title: 'Radiology',
    description: 'State-of-the-art imaging services including MRI, CT, and X-ray.',
    icon: 'Scan',
    image: 'https://picsum.photos/id/900/800/600'
  }
];

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Doctors', path: '/doctors' },
  { label: 'Contact', path: '/contact' },
];
