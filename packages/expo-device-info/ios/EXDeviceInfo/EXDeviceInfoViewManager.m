// Copyright 2016-present 650 Industries. All rights reserved.

#import <EXDeviceInfo/EXDeviceInfoView.h>
#import <EXDeviceInfo/EXDeviceInfoViewManager.h>

@interface EXDeviceInfoViewManager ()

@property (nonatomic, weak) EXModuleRegistry *moduleRegistry;

@end

@implementation EXDeviceInfoViewManager

EX_EXPORT_MODULE(ExpoDeviceInfoViewManager);

- (UIView *)view
{
  return [[EXDeviceInfoView alloc] initWithModuleRegistry:_moduleRegistry];
}

- (NSString *)viewName
{
  return @"ExpoDeviceInfoView";
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onSomethingHappened"];
}

- (void)setModuleRegistry:(EXModuleRegistry *)moduleRegistry
{
  _moduleRegistry = moduleRegistry;
}

@end
