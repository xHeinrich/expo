package expo.modules.deviceinfo;

import java.util.Map;

import android.content.Context;

import org.unimodules.core.ExportedModule;
import org.unimodules.core.ModuleRegistry;
import org.unimodules.core.Promise;
import org.unimodules.core.interfaces.ExpoMethod;
import org.unimodules.core.interfaces.ModuleRegistryConsumer;

public class DeviceInfoModule extends ExportedModule implements ModuleRegistryConsumer {
  private static final String NAME = "ExpoDeviceInfo";
  private static final String TAG = DeviceInfoModule.class.getSimpleName();

  private ModuleRegistry mModuleRegistry;

  public DeviceInfoModule(Context context) {
    super(context);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void setModuleRegistry(ModuleRegistry moduleRegistry) {
    mModuleRegistry = moduleRegistry;
  }

  @ExpoMethod
  public void someGreatMethodAsync(Map<String, Object> options, final Promise promise) {
  }
}
