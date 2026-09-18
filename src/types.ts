export type NavTabId = 'overview' | 'monitoring' | 'alerts' | 'training' | 'config';

export type AlertSeverity = 'critical' | 'severe' | 'info';

export type AlertStatus = 'unverified' | 'in_progress' | 'closed' | 'false_positive';

export interface AlertTimelineItem {
  time: string;
  title: string;
  desc: string;
  badge: string;
  elapsed: string;
  status: 'done' | 'current' | 'pending';
}

export interface AlertEvent {
  id: string;
  title: string;
  camera: string;
  cameraDesc: string;
  location: string;
  severity: AlertSeverity;
  type: string;
  timestamp: string;
  confidence: number;
  status: AlertStatus;
  operator: string;
  sla: string;
  model: string;
  rawFrameUrl: string;
  aiFrameUrl: string;
  timeline: AlertTimelineItem[];
}

export interface CameraNode {
  id: string;
  name: string;
  location: string;
  zone: string;
  workshop: string;
  ip: string;
  protocol: 'RTSP' | 'ONVIF';
  status: 'online' | 'alert' | 'offline';
  fps: number;
  bitrate: string;
  resolution: string;
  imageUrl: string;
  aiBoxes: Array<{
    top: string;
    left: string;
    width: string;
    height: string;
    label: string;
    confidence: string;
    color: 'emerald' | 'sky' | 'rose' | 'amber';
  }>;
}

export interface ModelPolicy {
  id: string;
  name: string;
  version: string;
  sha: string;
  description: string;
  icon: string;
  engine: string;
  node: string;
  boundChannels: number;
  totalChannels: number;
  confidenceThreshold: number;
  thresholdHint: string;
  nmsIou: number;
  nmsMode: string;
  fps: number;
  fpsHint: string;
  running: boolean;
  color: string;
}

export interface TrainingLog {
  timestamp: string;
  level: 'INFO' | 'CHECK' | 'TRAIN' | 'AUTOSAVE' | 'EVAL' | 'METRICS' | 'ERROR';
  message: string;
}

export interface ModelRegistryItem {
  version: string;
  tag: 'LATEST' | 'BASELINE' | 'LEGACY';
  architecture: string;
  map05: string;
  map05Delta?: string;
  latency: string;
  latencyDelta?: string;
  engineSize: string;
  edgeCoverage: string;
  coverageStatus: 'gray' | 'prod' | 'offline';
  canRollout: boolean;
}

export interface PTZState {
  zoom: number;
  focus: string;
  irNight: boolean;
  step: number;
  pan: number;
  tilt: number;
}
