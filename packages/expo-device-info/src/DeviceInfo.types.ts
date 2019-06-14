export type PowerState = {
    batteryLevel?: number;
    batteryState?: string;
    lowPowerMode?: boolean;
};
export type isPinOrFingerprintSetCallback = (isPinOrFingerprintSet: boolean) => void