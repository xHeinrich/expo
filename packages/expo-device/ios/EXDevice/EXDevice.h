// Copyright 2019-present 650 Industries. All rights reserved.

#import <UMCore/UMExportedModule.h>
#import <Foundation/Foundation.h>
#import <UMCore/UMEventEmitter.h>
#import <UMCore/UMEventEmitterService.h>
#import <UMCore/UMModuleRegistryConsumer.h>

@interface EXDevice : UMExportedModule <UMEventEmitter> 

@property (nonatomic) bool isEmulator;
@property (nonatomic) float lowBatteryThreshold;
@property (nonatomic, weak) id <UMEventEmitterService> eventEmitter;
@property (weak, nonatomic) UMModuleRegistry *moduleRegistry;

@end
