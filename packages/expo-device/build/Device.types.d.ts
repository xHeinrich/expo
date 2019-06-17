export declare type PowerState = {
    batteryLevel?: number;
    batteryState?: string;
    lowPowerMode?: boolean;
};
export declare type isPinOrFingerprintSetCallback = (isPinOrFingerprintSet: boolean) => void;
export declare const devicesWithNotch: {
    brand: string;
    model: string;
}[];
