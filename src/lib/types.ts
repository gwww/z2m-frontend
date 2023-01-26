// Placeholder for object attributes not used by this app
// As the code develops the NotUsed may be replaced with actual type info
export type NotUsed = any;

export interface Dictionary<T> {
    [key: string]: T;
}

export type GenericObject = Record<string, unknown>;

export type DeviceState = GenericObject | undefined;

export type DeviceType = 'Router' | 'Coordinator' | 'EndDevice';

export interface DeviceDefinition {
    description: string;
    model: string;
    vendor: string;
    supports_ota: boolean;

    exposes: NotUsed;
    options: NotUsed;
}

export interface Device {
    friendly_name: string;
    manufacturer: string;
    model_id: string;
    ieee_address: string;
    network_address: number;
    interview_completed: boolean;
    interviewing: boolean;
    power_source: string;
    software_build_id: string;
    supported: boolean;
    type: DeviceType;
    datecode: string;
    definition: DeviceDefinition;
}
