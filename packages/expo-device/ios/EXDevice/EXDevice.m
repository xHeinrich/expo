// Copyright 2018-present 650 Industries. All rights reserved.

#import <EXDevice/EXDevice.h>
#import "DeviceUID.h"
#import <UMCore/UMUtilities.h>


#include <ifaddrs.h>
#include <arpa/inet.h>
#import <mach-o/arch.h>
#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>
#import <sys/utsname.h>

#import <CoreTelephony/CTCallCenter.h>
#import <CoreTelephony/CTCall.h>
#import <CoreTelephony/CTCarrier.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>

#if !(TARGET_OS_TV)
#import <LocalAuthentication/LocalAuthentication.h>
#endif


@implementation EXDevice
{
  bool hasListeners;
}

UM_EXPORT_MODULE(ExpoDevice);

- (void)setModuleRegistry:(UMModuleRegistry *)moduleRegistry
{
  _moduleRegistry = moduleRegistry;
  _eventEmitter = [moduleRegistry getModuleImplementingProtocol:@protocol(UMEventEmitterService)];
}

UM_EXPORT_METHOD_AS(getMACAddressAsync,
                    resolver:(UMPromiseResolveBlock)resolve
                    rejecter:(UMPromiseRejectBlock)reject) {
  NSString *address = @"02:00:00:00:00:00";
  resolve(address);
}

- (id)init
{
  if ((self = [super init])) {
#if !TARGET_OS_TV
    _lowBatteryThreshold = 20;
    [[UIDevice currentDevice] setBatteryMonitoringEnabled:YES];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(batteryLevelDidChange:)
                                                 name:UIDeviceBatteryLevelDidChangeNotification
                                               object: nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(powerStateDidChange:)
                                                 name:UIDeviceBatteryStateDidChangeNotification
                                               object: nil];
#endif
  }
  
  return self;
}



- (NSArray<NSString *> *)supportedEvents
{
  return @[@"Expo.batteryLevelDidChange", @"Expo.batteryLevelIsLow", @"Expo.powerStateDidChange"];
}

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

- (void)batteryLevelDidChange:(NSNotification *)notification
{
  if (!hasListeners) {
    return;
  }
  
  float batteryLevel = [self.powerState[@"batteryLevel"] floatValue];
  [_eventEmitter sendEventWithName:@"Expo.batteryLevelDidChange" body:@(batteryLevel)];
  
  if (batteryLevel <= _lowBatteryThreshold) {
    [_eventEmitter sendEventWithName:@"Expo.batteryLevelIsLow" body:@(batteryLevel)];
  }
}

- (void)powerStateDidChange:(NSNotification *)notification
{
  if (!hasListeners) {
    return;
  }
  
  [_eventEmitter sendEventWithName:@"Expo.powerStateDidChange" body:self.powerState];
}


- (NSDictionary *)powerState
{
#if RCT_DEV && (!TARGET_IPHONE_SIMULATOR) && !TARGET_OS_TV
  if ([UIDevice currentDevice].isBatteryMonitoringEnabled != true) {
    RCTLogWarn(@"Battery monitoring is not enabled. "
               "You need to enable monitoring with `[UIDevice currentDevice].batteryMonitoringEnabled = TRUE`");
  }
#endif
#if RCT_DEV && TARGET_IPHONE_SIMULATOR && !TARGET_OS_TV
  if ([UIDevice currentDevice].batteryState == UIDeviceBatteryStateUnknown) {
    RCTLogWarn(@"Battery state `unknown` and monitoring disabled, this is normal for simulators and tvOS.");
  }
#endif
  
  return @{
#if TARGET_OS_TV
           @"batteryLevel": @1,
           @"batteryState": @"full",
#else
           @"batteryLevel": @([UIDevice currentDevice].batteryLevel),
           @"batteryState": [@[@"unknown", @"unplugged", @"charging", @"full"] objectAtIndex: [UIDevice currentDevice].batteryState],
           @"lowPowerMode": @([NSProcessInfo processInfo].isLowPowerModeEnabled),
#endif
           };
}

UM_EXPORT_METHOD_AS(getPowerStateAsync,
                    getPowerStateAsyncWithResolver:(UMPromiseResolveBlock)resolve rejecter:(UMPromiseRejectBlock)reject)
{
  return resolve(self.powerState);
}

UM_EXPORT_METHOD_AS(getBatteryLevelAsync,
                    getBatteryLevelAsyncWithResolver:(UMPromiseResolveBlock)resolve
                    rejecter:(UMPromiseRejectBlock)reject)
{
  resolve(@([self.powerState[@"batteryLevel"] floatValue]));
}

UM_EXPORT_METHOD_AS(isBatteryChargingAsync,
                    isBatteryCharingAsyncWithResolver:(UMPromiseResolveBlock)resolve rejecter:(UMPromiseRejectBlock)reject)
{
  BOOL isCharging = [self.powerState[@"batteryState"] isEqualToString:@"charging"];
  resolve(@(isCharging));
}


UM_EXPORT_METHOD_AS(getIPAddressAsync,
                    getIPAddressAsyncWithResolver:(UMPromiseResolveBlock)resolve rejecter:(UMPromiseRejectBlock)reject)
{
  NSString *address = @"0.0.0.0";
  struct ifaddrs *interfaces = NULL;
  struct ifaddrs *temp_addr = NULL;
  int success = 0;
  // retrieve the current interfaces - returns 0 on success
  success = getifaddrs(&interfaces);
  if (success == 0) {
    // Loop through linked list of interfaces
    temp_addr = interfaces;
    while(temp_addr != NULL) {
      if(temp_addr->ifa_addr->sa_family == AF_INET) {
        // Check if interface is en0 which is the wifi connection on the iPhone
        if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"]) {
          // Get NSString from C String
          address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];
        }
      }
      temp_addr = temp_addr->ifa_next;
    }
  }
  // Free memory
  freeifaddrs(interfaces);
  resolve(address);
}

UM_EXPORT_METHOD_AS(isPinOrFingerprintSetAsync, isPinOrFingerprintSetAsyncWithResolver:(UMPromiseResolveBlock)resolve rejecter:(UMPromiseRejectBlock)reject)
{
#if TARGET_OS_TV
  BOOL isPinOrFingerprintSet = false;
#else
  LAContext *context = [[LAContext alloc] init];
  BOOL isPinOrFingerprintSet = ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:nil]);
#endif
  resolve(@[[NSNumber numberWithBool:isPinOrFingerprintSet]]);
}

- (NSString*) deviceId
{
  struct utsname systemInfo;
  
  uname(&systemInfo);
  
  NSString* deviceId = [NSString stringWithCString:systemInfo.machine
                                          encoding:NSUTF8StringEncoding];
  
  if ([deviceId isEqualToString:@"i386"] || [deviceId isEqualToString:@"x86_64"] ) {
    deviceId = [NSString stringWithFormat:@"%s", getenv("SIMULATOR_MODEL_IDENTIFIER")];
  }
  
  return deviceId;
}

- (NSString *) carrier
{
#if (TARGET_OS_TV)
  return nil;
#else
  CTTelephonyNetworkInfo *netinfo = [[CTTelephonyNetworkInfo alloc] init];
  CTCarrier *carrier = [netinfo subscriberCellularProvider];
  return carrier.carrierName;
#endif
}

/*device types*/
typedef NS_ENUM(NSInteger, DeviceType) {
  DeviceTypeHandset,
  DeviceTypeTablet,
  DeviceTypeTv,
  DeviceTypeUnknown
};

#define DeviceTypeValues [NSArray arrayWithObjects: @"Handset", @"Tablet", @"Tv", @"Unknown", nil]

- (DeviceType) getDeviceType
{
  switch ([[UIDevice currentDevice] userInterfaceIdiom]) {
    case UIUserInterfaceIdiomPhone: return DeviceTypeHandset;
    case UIUserInterfaceIdiomPad: return DeviceTypeTablet;
    case UIUserInterfaceIdiomTV: return DeviceTypeTv;
    default: return DeviceTypeUnknown;
  }
}

- (bool) isTablet
{
  return [self getDeviceType] == DeviceTypeTablet;
}

- (NSString *)getCPUType {
  /* https://stackoverflow.com/questions/19859388/how-can-i-get-the-ios-device-cpu-architecture-in-runtime */
  const NXArchInfo *info = NXGetLocalArchInfo();
  NSString *typeOfCpu = [NSString stringWithUTF8String:info->description];
  return typeOfCpu;
}


- (unsigned long long) totalMemory {
  return [NSProcessInfo processInfo].physicalMemory;
}

- (NSDictionary *) getStorageDictionary {
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  return [[NSFileManager defaultManager] attributesOfFileSystemForPath:[paths lastObject] error: nil];
}

- (uint64_t) totalDiskCapacity {
  uint64_t totalSpace = 0;
  NSDictionary *storage = [self getStorageDictionary];
  
  if (storage) {
    NSNumber *fileSystemSizeInBytes = [storage objectForKey: NSFileSystemSize];
    totalSpace = [fileSystemSizeInBytes unsignedLongLongValue];
  }
  return totalSpace;
}

- (uint64_t) freeDiskStorage {
  uint64_t freeSpace = 0;
  NSDictionary *storage = [self getStorageDictionary];
  
  if (storage) {
    NSNumber *freeFileSystemSizeInBytes = [storage objectForKey: NSFileSystemFreeSize];
    freeSpace = [freeFileSystemSizeInBytes unsignedLongLongValue];
  }
  return freeSpace;
}

//- (NSString*) userAgent
//{
//#if TARGET_OS_TV
//  return @"not available";
//#else
//  UIWebView* webView = [[UIWebView alloc] initWithFrame:CGRectZero];
//  return [webView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
//#endif
//}

- (NSDictionary *)constantsToExport
{
  UIDevice *currentDevice = [UIDevice currentDevice];
  NSString *uniqueId = [DeviceUID uid]; //TODO: need to import this
  
  return @{
           @"brand": @"Apple",
           @"carrier": self.carrier ?: [NSNull null],
           @"deviceType": [DeviceTypeValues objectAtIndex: [self getDeviceType]] ?: [NSNull null],
           @"deviceName": @"name here", //TODO, ADD TO JS AS WELL
           @"deviceId": self.deviceId ?: [NSNull null],
           @"freeDiskStorage": @(self.freeDiskStorage),
           //           @"hasNotch": @YES, // implement into the js
           //           @"isEmulator": @NO,
           @"isTablet": @(self.isTablet),
           @"manufacturer": @"Apple",
           //           @"model": self.deviceId, // DON'T WORRY ABOUT FOR NOW
           //           @"phoneNumber": @"undefined3", // ANDROID ONLY
           //           @"serialNumber": @"undefined4", // ANDROID ONLY
           @"supportedABIs": @[[self getCPUType]],
           @"systemName": currentDevice.systemName,
           @"totalMemory": @(self.totalMemory),
           @"totalDiskCapacity": @(self.totalDiskCapacity),
           @"uniqueId": uniqueId,
           @"userAgent": [NSNull null] //self.userAgent ?: [NSNull null],
           };
}

@end

