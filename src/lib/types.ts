// Placeholder for object attributes not used by this app
// As the code develops the NotDefinedYet may be replaced with actual type info
export type NotDefinedYet = any;

export interface Dictionary<T> {
    [key: string]: T;
}

export type GenericObject = Record<string, unknown>;

export interface DeviceState {
    last_seen?: string;
}

export type DeviceType = 'Router' | 'Coordinator' | 'EndDevice';

export interface DeviceDefinition {
    description: string;
    model: string;
    vendor: string;
    supports_ota: boolean;

    exposes: NotDefinedYet;
    options: NotDefinedYet;
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

export interface Availability {
    active?: number;
    passive?: number;
}

export interface AdvancedConfig {
    last_seen?: 'disable' | 'ISO_8601' | 'ISO_8601_local' | 'epoch';
    // Lots more stuff
}

export interface ConfigInfo {
    advanced: AdvancedConfig;
    availability?: Availability;
    blocklist: string[];
    device_options: NotDefinedYet;
    devices: NotDefinedYet;
    external_converters: string[];
    frontend: NotDefinedYet;
    groups: NotDefinedYet;
    homeassistant: NotDefinedYet;
    map_options: NotDefinedYet;
    mqtt: NotDefinedYet;
    ota: NotDefinedYet;
    passlist: string[];
    permit_join: boolean;
    serial: NotDefinedYet;
}

export interface BridgeInfo {
    config: ConfigInfo;
    config_schema: NotDefinedYet;
    coordinator: NotDefinedYet;
    log_level: string;
    network: NotDefinedYet;
    permit_join: boolean;
    restart_required: boolean;
    version: string;
}
