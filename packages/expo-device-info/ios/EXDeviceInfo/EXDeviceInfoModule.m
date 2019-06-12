// Copyright 2018-present 650 Industries. All rights reserved.

#import <EXDeviceInfo/EXDeviceInfoModule.h>

@interface EXDeviceInfoModule ()

@property (nonatomic, weak) EXModuleRegistry *moduleRegistry;

@end

@implementation EXDeviceInfoModule

EX_EXPORT_MODULE(ExpoDeviceInfo);

- (void)setModuleRegistry:(EXModuleRegistry *)moduleRegistry
{
  _moduleRegistry = moduleRegistry;
}

EX_EXPORT_METHOD_AS(someGreatMethodAsync,
                    options:(NSDictionary *)options
                    resolve:(EXPromiseResolveBlock)resolve
                    reject:(EXPromiseRejectBlock)reject)
{
}

@end
