// Placeholder for object attributes not used by this app
// As the code develops the NotDefinedYet may be replaced with actual type info
export type NotDefinedYet = any;

export interface Dictionary<T> {
    [key: string]: T;
}

export type GenericObject = Record<string, unknown>;

export type PowerSource = 'Battery' | 'DC Source' | 'Mains (single phase)';

export interface DeviceState {
    last_seen?: string;
    battery?: number;
    linkquality: number;
}

export enum AccessType {
    ACCESS_PUBLISHED = 0b001,
    ACCESS_WRITE = 0b010,
    ACCESS_READ = 0b100,
}

export const EXPOSED_TYPE = ['binary', 'enum', 'list', 'numeric', 'text'] as const;
export type ExposedType = typeof EXPOSED_TYPE[number];

export const EXPOSED_FEATURE_TYPE = ['composite', 'light', 'switch'] as const;
export type ExposedFeatureType = typeof EXPOSED_FEATURE_TYPE[number]

export interface ExposedItemBase {
    type: ExposedType,
    name: string,
    property: string,
    access: AccessType,
    description: string,
    unit?: string,
}

export interface ExposedBinary extends ExposedItemBase {
    type: 'binary'
    value_on: string,
    value_off: string,
    value_toggle?: string,
}

export interface ExposedEnum extends ExposedItemBase {
    type: 'enum',
    values: string[],
}

export interface NumericPreset {
    name: string,
    description: string,
    value: number,
}

export interface ExposedNumeric extends ExposedItemBase {
    type: 'numeric',
    value_min?: string,
    value_max?: string,
    presets: NumericPreset[],
}

export interface ExposedText extends ExposedItemBase {
    type: 'text',
}

export interface ExposedFeature {
    type: ExposedFeatureType,
    features: ExposedItemBase[],
    property?: string,
    name?: string,
}

export type Exposes = ExposedFeature | ExposedItemBase;

export type DeviceType = 'Router' | 'Coordinator' | 'EndDevice';

export interface DeviceDefinition {
    description: string;
    model: string;
    vendor: string;
    supports_ota: boolean;

    exposes: Exposes[],
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
    power_source: PowerSource;
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

export interface ConfigInfoDevice {
    friendly_name: string,
    description?: string,
}

export interface ConfigInfo {
    advanced: AdvancedConfig;
    availability?: Availability;
    blocklist: string[];
    device_options: NotDefinedYet;
    devices: Dictionary<ConfigInfoDevice>,
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

export interface ConsolidatedDevice {
    friendly_name: string,
    description?: string,
    availability?: boolean,
    ieee_address: string,
    config_info?: ConfigInfoDevice,
    device?: Device,
    state?: DeviceState,
}
