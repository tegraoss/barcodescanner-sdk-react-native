package com.scandit.reactnative

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.SimpleViewManager
import kotlin.collections.ArrayList

class ScanditPackage() : ReactPackage {

    private val cameraApiSetting = CameraApiSetting()

    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
        val modules = ArrayList<NativeModule>()
        modules.add(ScanditModule(reactContext, cameraApiSetting))
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<SimpleViewManager<View>> {
        val managers = ArrayList<SimpleViewManager<View>>()
        managers.add(BarcodePicker(cameraApiSetting) as SimpleViewManager<View>)
        return managers
    }
}

data class CameraApiSetting(var cameraApi: Int = 1)
