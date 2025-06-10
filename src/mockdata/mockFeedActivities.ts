import { Activity, AuthorInfo, ReferencePoint } from '../types/activityTypes';

const author1: AuthorInfo = { _id: 'user123', username: 'AletaCorredora' };
const author2: AuthorInfo = { _id: 'user456', username: 'CiclistaVeloz' };
const author3: AuthorInfo = { _id: 'user789', username: 'MuntanyencExpert' };

const sampleRoute1: ReferencePoint[] = [
  { _id: 'rp1', latitude: 41.3851, longitude: 2.1734, timestamp: new Date().toISOString() },
  { _id: 'rp2', latitude: 41.3861, longitude: 2.1744, timestamp: new Date().toISOString() },
  { _id: 'rp3', latitude: 41.3871, longitude: 2.1754, timestamp: new Date().toISOString() },
];
const sampleRoute2: ReferencePoint[] = [
  { _id: 'rp4', latitude: 40.4168, longitude: -3.7038, timestamp: new Date().toISOString() },
  { _id: 'rp5', latitude: 40.4178, longitude: -3.7048, timestamp: new Date().toISOString() },
];

export const mockFeedActivities: Activity[] = [
  {
    _id: 'feedActivity1',
    author: author1,
    name: 'Cursa Matinal pel Parc Güell',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    distance: 7500,
    elevationGain: 150,
    averageSpeed: 7.5,
    type: 'running',
    route: sampleRoute1,
    caloriesBurned: 500,
  },
  {
    _id: 'feedActivity2',
    author: author2,
    name: 'Volta Ciclista a Collserola',
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    duration: 180,
    distance: 60000,
    elevationGain: 700,
    averageSpeed: 20,
    type: 'cycling',
    route: [],
    musicPlaylist: [],
  },
  {
    _id: 'feedActivity3',
    author: author1,
    name: 'Passeig Relaxant per la Platja',
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    duration: 45,
    distance: 4000,
    elevationGain: 10,
    averageSpeed: 5.3,
    type: 'walking',
    route: sampleRoute2,
  },
  {
    _id: 'feedActivity4',
    author: author3,
    name: 'Excursió al Matagalls',
    startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
    duration: 300,
    distance: 15000,
    elevationGain: 950,
    averageSpeed: 3,
    type: 'hiking',
    route: [],
  },
];
