package com.scandit.reactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.scandit.barcodepicker.ScanditLicense

class ScanditModule(
    reactContext: ReactApplicationContext,
    val cameraApiSetting: CameraApiSetting
) : ReactContextBaseJavaModule(reactContext)  {

    override fun getName(): String = "ScanditModule"

    @ReactMethod
    fun setAppKey(key: String) {
        ScanditLicense.setAppKey(key)
    }

    @ReactMethod
    fun setCameraApi(newCameraApi: Int) {
        cameraApiSetting.cameraApi = newCameraApi
    }
}
