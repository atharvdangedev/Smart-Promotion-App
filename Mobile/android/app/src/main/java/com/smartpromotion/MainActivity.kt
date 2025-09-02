package com.smartpromotion

import android.content.Intent
import android.content.pm.PackageManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import android.os.Build
import androidx.core.content.ContextCompat
import com.smartpromotion.CallLogMonitorService
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.os.Bundle
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootTheme)
    super.onCreate(savedInstanceState)
    val callLogGranted = checkSelfPermission(android.Manifest.permission.READ_CALL_LOG) == PackageManager.PERMISSION_GRANTED
    val postNotifGranted = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
    checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
    else true

    if (callLogGranted && postNotifGranted) {
      ContextCompat.startForegroundService(this, Intent(this, CallLogMonitorService::class.java))
    } else {
    val perms = mutableListOf<String>()
    if (!callLogGranted) perms.add(android.Manifest.permission.READ_CALL_LOG)
    if (!postNotifGranted) perms.add(android.Manifest.permission.POST_NOTIFICATIONS)
    requestPermissions(perms.toTypedArray(), 100)
}

  }

    override fun getMainComponentName(): String = "SmartPromotion"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
