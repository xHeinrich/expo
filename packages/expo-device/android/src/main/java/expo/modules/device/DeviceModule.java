package expo.modules.device;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.BatteryManager;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.view.SurfaceHolder.Callback;
import android.app.KeyguardManager;
import android.view.View;
import android.os.StatFs;
import android.telephony.TelephonyManager;
import android.app.ActivityManager;
import android.app.UiModeManager;
import android.view.WindowManager;
import android.util.DisplayMetrics;
import android.content.res.Configuration;

import org.unimodules.core.ExportedModule;
import org.unimodules.core.ModuleRegistry;
import org.unimodules.core.Promise;
import org.unimodules.core.interfaces.ExpoMethod;
import org.unimodules.core.interfaces.RegistryLifecycleListener;

import java.math.BigInteger;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class DeviceModule extends ExportedModule implements RegistryLifecycleListener {
  private static final String NAME = "ExpoDevice";
  private static final String TAG = DeviceModule.class.getSimpleName();

  private ModuleRegistry mModuleRegistry;
  private Context mContext;
  private WifiInfo wifiInfo;
  DeviceType deviceType;

  public DeviceModule(Context context) {
    super(context);
    mContext = context;
    deviceType = this.getDeviceType(context);
  }

  public enum DeviceType {
    HANDSET ("Handset"),
    TABLET ("Tablet"),
    TV ("Tv"),
    UNKNOWN ("Unknown");

    private final String value;

    DeviceType(String value) {
      this.value = value;
    }

    public String getValue() {
      return value;
    }
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


  @Override
  public Map<String, Object> getConstants() {
    HashMap<String, Object> constants = new HashMap<>();

    Bundle bundle = getBundledConstants();
    for (String key : bundle.keySet()) {
      constants.put(key, bundle.get(key));
    }
    return constants;
  }

  private Bundle getBundledConstants() {
    Bundle constants = new Bundle();

    constants.putString("brand", Build.BRAND);
    constants.putString("carrier", this.getCarrier());
    constants.putString("manufacturer", Build.MANUFACTURER);
    constants.putString("model", Build.MODEL);
    constants.putString("phoneNumber", getPhoneNumber());
    constants.putString("serialNumber", Build.SERIAL);
    constants.putString("systemName", "Android");
    constants.putString("deviceId", Build.BOARD);
    constants.putLong("totalDiskCapacity", this.getTotalDiskCapacity().longValue());
    constants.putString("uniqueId", Settings.Secure.getString(mContext.getContentResolver(), Settings.Secure.ANDROID_ID));
    constants.putString("userAgent", System.getProperty("http.agent"));
    constants.putString("deviceType", deviceType.getValue());
    constants.putBoolean("isTablet", this.isTablet());
    constants.putStringArray("supportedABIs", Build.SUPPORTED_ABIS);

    ActivityManager actMgr = (ActivityManager) mContext.getSystemService(Context.ACTIVITY_SERVICE);
    ActivityManager.MemoryInfo memInfo = new ActivityManager.MemoryInfo();
    actMgr.getMemoryInfo(memInfo);
    constants.putLong("totalMemory", memInfo.totalMem);

    try{
      constants.putLong("freeDiskStorage", this.getFreeDiskStorage().longValue());
    }
    catch(NullPointerException e){
      e.printStackTrace();
      constants.putLong("freeDiskStorage", (Long)null);
    }

    return constants;
  }

  private BigInteger getFreeDiskStorage() {
    try {
      StatFs external = new StatFs(Environment.getExternalStorageDirectory().getAbsolutePath());
      long availableBlocks;
      long blockSize;

      availableBlocks = external.getAvailableBlocksLong();
      blockSize = external.getBlockSizeLong();

      return BigInteger.valueOf(availableBlocks).multiply(BigInteger.valueOf(blockSize));
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  private String getCarrier() {
    TelephonyManager telMgr = (TelephonyManager) mContext.getSystemService(Context.TELEPHONY_SERVICE);
    return telMgr.getNetworkOperatorName();
  }

  private String getPhoneNumber() {
    try{
      TelephonyManager telMgr = (TelephonyManager) mContext.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
      return telMgr.getLine1Number();
    }
    catch(SecurityException se){
      Log.e(TAG, se.getMessage());
    }
    return null;
  }

  private BigInteger getTotalDiskCapacity() {
    try {
      StatFs root = new StatFs(Environment.getRootDirectory().getAbsolutePath());
      return BigInteger.valueOf(root.getBlockCountLong()).multiply(BigInteger.valueOf(root.getBlockSizeLong()));
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  private static DeviceType getDeviceType(Context context){
    // Detect TVs via ui mode (Android TVs) or system features (Fire TV).
    if (context.getApplicationContext().getPackageManager().hasSystemFeature("amazon.hardware.fire_tv")) {
      return DeviceType.TV;
    }

    UiModeManager uiManager = (UiModeManager) context.getSystemService(Context.UI_MODE_SERVICE);
    if (uiManager != null && uiManager.getCurrentModeType() == Configuration.UI_MODE_TYPE_TELEVISION) {
      return DeviceType.TV;
    }

    // Find the current window manager, if none is found we can't measure the device physical size.
    WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
    if (windowManager == null) {
      return DeviceType.UNKNOWN;
    }

    // Get display metrics to see if we can differentiate handsets and tablets.
    // NOTE: for API level 16 the metrics will exclude window decor.
    DisplayMetrics metrics = new DisplayMetrics();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
      windowManager.getDefaultDisplay().getRealMetrics(metrics);
    } else {
      windowManager.getDefaultDisplay().getMetrics(metrics);
    }

    // Calculate physical size.
    double widthInches = metrics.widthPixels / (double) metrics.xdpi;
    double heightInches = metrics.heightPixels / (double) metrics.ydpi;
    double diagonalSizeInches = Math.sqrt(Math.pow(widthInches, 2) + Math.pow(heightInches, 2));

    if (diagonalSizeInches >= 3.0 && diagonalSizeInches <= 6.9) {
      // Devices in a sane range for phones are considered to be Handsets.
      return DeviceType.HANDSET;
    } else if (diagonalSizeInches > 6.9 && diagonalSizeInches <= 18.0) {
      // Devices larger than handset and in a sane range for tablets are tablets.
      return DeviceType.TABLET;
    } else {
      // Otherwise, we don't know what device type we're on/
      return DeviceType.UNKNOWN;
    }
  }

  private boolean isTablet(){
    return deviceType.getValue() == "Tablet";
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
      Integer ipAddress = getWifiInfo().getIpAddress();
      // Convert little-endian to big-endianif needed
      if (ByteOrder.nativeOrder().equals(ByteOrder.LITTLE_ENDIAN)) {
        ipAddress = Integer.reverseBytes(ipAddress);
      }

      byte[] ipByteArray = BigInteger.valueOf(ipAddress).toByteArray();

      String ipAddressString;
      try {
        ipAddressString = InetAddress.getByAddress(ipByteArray).getHostAddress();
      } catch (Exception ex) {
        Log.e("WIFIIP", "Unable to get host address.");
        ipAddressString = null;
      }
      promise.resolve(ipAddressString);
    }
    catch(Exception e){
      Log.e(TAG, e.getMessage());
      promise.reject(e);
    }
  }

  @ExpoMethod
  public void getMACAddressAsync(Promise promise) {

    String macAddress = getWifiInfo().getMacAddress();

    String permission = "android.permission.INTERNET";
    int res = mContext.checkCallingOrSelfPermission(permission);

    if (res == PackageManager.PERMISSION_GRANTED) {
      try {
        List<NetworkInterface> all = Collections.list(NetworkInterface.getNetworkInterfaces());
        for (NetworkInterface nif : all) {
          if (!nif.getName().equalsIgnoreCase("wlan0")) continue;

          byte[] macBytes = nif.getHardwareAddress();
          if (macBytes == null) {
            macAddress = "";
          } else {

            StringBuilder res1 = new StringBuilder();
            for (byte b : macBytes) {
              res1.append(String.format("%02X:", b));
            }

            if (res1.length() > 0) {
              res1.deleteCharAt(res1.length() - 1);
            }
            macAddress = res1.toString();
          }
        }
      } catch (Exception ex) {
      }
    }

    promise.resolve(macAddress);
  }

  @ExpoMethod
  public void isAirplaneModeAsync(Promise promise) {
    boolean isAirPlaneMode;

    isAirPlaneMode = Settings.Global.getInt(mContext.getContentResolver(),Settings.Global.AIRPLANE_MODE_ON, 0) != 0;

    promise.resolve(isAirPlaneMode);
  }

  @ExpoMethod
  public void isBatteryChargingAsync(Promise promise) {
    IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
    Intent batteryStatus = mContext.getApplicationContext().registerReceiver(null, intentFilter);
    int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
    boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING;
    promise.resolve(isCharging);
  }

  @ExpoMethod
  public void hasSystemFeatureAsync(String feature, Promise promise) {
    if (feature == null || feature == "") {
      promise.resolve(false);
      return;
    }

    boolean hasFeature = mContext.getApplicationContext().getPackageManager().hasSystemFeature(feature);
    promise.resolve(hasFeature);
  }

//  @ExpoMethod
//  public void isPinOrFingerprintSet(Callback callback) {
//    KeyguardManager keyguardManager = (KeyguardManager) mContext.getApplicationContext().getSystemService(Context.KEYGUARD_SERVICE); //api 16+
//    callback.invoke(keyguardManager.isKeyguardSecure());
//  }
}
