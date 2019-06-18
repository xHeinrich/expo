// Copyright 2019-present 650 Industries. All rights reserved.

#import <UMCore/UMExportedModule.h>
#import <Foundation/Foundation.h>

@interface EXDevice : UMExportedModule

@property (nonatomic) bool isEmulator;
@property (nonatomic) float lowBatteryThreshold;

@end
