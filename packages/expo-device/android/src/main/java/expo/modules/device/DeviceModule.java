package expo.modules.device;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.BatteryManager;
import android.util.Log;

import org.unimodules.core.ExportedModule;
import org.unimodules.core.ModuleRegistry;
import org.unimodules.core.Promise;
import org.unimodules.core.interfaces.ExpoMethod;
import org.unimodules.core.interfaces.RegistryLifecycleListener;

import java.net.InetAddress;

public class DeviceModule extends ExportedModule implements RegistryLifecycleListener {
  private static final String NAME = "ExpoDevice";
  private static final String TAG = DeviceModule.class.getSimpleName();

  private ModuleRegistry mModuleRegistry;
  private Context mContext;
  private WifiInfo wifiInfo;
  private InetAddress inetAddress;

  public DeviceModule(Context context) {
    super(context);
    mContext = context;
  }

  private WifiInfo getWifiInfo() {
    if (this.wifiInfo == null) {
      WifiManager manager = (WifiManager) mContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
      this.wifiInfo = manager.getConnectionInfo();
    }
    return this.wifiInfo;
  }


  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void onCreate(ModuleRegistry moduleRegistry) {
    mModuleRegistry = moduleRegistry;
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
    try{
      inetAddress = InetAddress.getLocalHost();
      String ipAddress = inetAddress.getHostAddress();
      promise.resolve(ipAddress);
      Integer intForm = getWifiInfo().getIpAddress();
      inetAddress= InetAddress.getByName(String.valueOf(intForm));
      String ip= inetAddress.getHostAddress();
    }
    catch(Exception e){
      Log.e(TAG, e.getMessage());
      promise.reject(e);
    }
  }
}
