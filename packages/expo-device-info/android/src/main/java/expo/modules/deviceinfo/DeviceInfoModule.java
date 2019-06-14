package expo.modules.deviceinfo;

import java.util.Map;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.net.wifi.WifiManager;
import android.net.wifi.WifiInfo;

import org.unimodules.core.ExportedModule;
import org.unimodules.core.ModuleRegistry;
import org.unimodules.core.Promise;
import org.unimodules.core.interfaces.ExpoMethod;
import org.unimodules.core.interfaces.RegistryLifecycleListener;

import java.net.InetAddress;

public class DeviceInfoModule extends ExportedModule implements RegistryLifecycleListener {
  private static final String NAME = "ExpoDeviceInfo";
  private static final String TAG = DeviceInfoModule.class.getSimpleName();

  private ModuleRegistry mModuleRegistry;
  private Context mContext;
  private WifiInfo wifiInfo;

  public DeviceInfoModule(Context context) {
    super(context);
    mContext = context;
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void onCreate(ModuleRegistry moduleRegistry) {
    mModuleRegistry = moduleRegistry;
  }

  private WifiInfo getWifiInfo() {
    if (this.wifiInfo == null) {
      WifiManager manager = (WifiManager) mContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
      this.wifiInfo = manager.getConnectionInfo();
    }
    return this.wifiInfo;
  }

  @ExpoMethod
  public void getBatteryLevelAsync(Promise promise) {
    Intent batteryIntent = mContext.getApplicationContext().registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    int level = batteryIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
    int scale = batteryIntent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
    float batteryLevel = level / (float) scale;
    promise.resolve(batteryLevel);
  }

  @ExpoMethod
  public void getIPAddressAsync(Promise promise) {
    String ipAddress = InetAddress.getHostAddress();
    promise.resolve(ipAddress);
  }
}
