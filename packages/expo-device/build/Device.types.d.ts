export declare type PowerState = {
    batteryLevel?: number;
    batteryState?: string;
    lowPowerMode?: boolean;
};
export declare type isPinOrFingerprintSetCallback = (isPinOrFingerprintSet: boolean) => void;
export declare type deviceBatteryUpdateCallback = (result: number) => void;
export declare type devicePowerStateUpdate = (result: PowerState) => void;
export declare const devicesWithNotch: {
    brand: string;
    model: string;
}[];
