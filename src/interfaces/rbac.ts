export type UserRole = "admin" | "user";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
}

export interface RelayChannel {
  state: "ON" | "OFF";
  buttonEnable: boolean;
  name: string;
}

export interface DeviceMeta {
  assignedUser: string;
  installationDate: string;
  location: string;
}

export interface DeviceStatus {
  rssi: number;
  last_seen: number;
}

export interface SmartDevice {
  meta?: DeviceMeta;
  status?: DeviceStatus;
  controls?: {
    [relayId: string]: RelayChannel;
  };
}

export interface SystemDevices {
  [deviceId: string]: SmartDevice;
}