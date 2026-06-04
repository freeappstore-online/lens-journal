export type SceneTag =
  | 'portrait'
  | 'landscape'
  | 'street'
  | 'macro'
  | 'night'
  | 'wildlife'
  | 'architecture'
  | 'travel'
  | 'sports'
  | 'abstract'

export const SCENE_TAGS: SceneTag[] = [
  'portrait', 'landscape', 'street', 'macro', 'night',
  'wildlife', 'architecture', 'travel', 'sports', 'abstract',
]

export const TAG_LABELS: Record<SceneTag, string> = {
  portrait: 'Portrait',
  landscape: 'Landscape',
  street: 'Street',
  macro: 'Macro',
  night: 'Night',
  wildlife: 'Wildlife',
  architecture: 'Architecture',
  travel: 'Travel',
  sports: 'Sports',
  abstract: 'Abstract',
}

export const APERTURES = [
  'f/1.0', 'f/1.2', 'f/1.4', 'f/1.8', 'f/2.0', 'f/2.8',
  'f/4.0', 'f/5.6', 'f/8.0', 'f/11', 'f/16', 'f/22',
]

export const SHUTTERS = [
  '1/8000', '1/4000', '1/2000', '1/1000', '1/500', '1/250',
  '1/125', '1/60', '1/30', '1/15', '1/8', '1/4', '1/2',
  '1"', '2"', '4"', '8"', '15"', '30"', 'BULB',
]

export const ISOS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600]

export interface Shot {
  id: string
  aperture: string
  shutter: string
  iso: number
  focalLength: number   // mm, 0 = not set
  lens: string
  tags: SceneTag[]
  note: string
  createdAt: string
}

export interface Session {
  id: string
  title: string
  date: string          // YYYY-MM-DD
  location: string
  learningNote: string
  shots: Shot[]
  createdAt: string
}
