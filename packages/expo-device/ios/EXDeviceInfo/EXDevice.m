// Copyright 2018-present 650 Industries. All rights reserved.

#import <EXDevice/EXDevice.h>

@implementation EXDevice

UM_EXPORT_MODULE(ExpoDevice);

UM_EXPORT_METHOD_AS(digestStringAsync,
                    digestStringAsync:(NSString *)algorithm
                    data:(NSString *)data
                    options:(NSDictionary *)options
                    resolver:(UMPromiseResolveBlock)resolve
                    rejecter:(UMPromiseRejectBlock)reject)
{
}


@end

