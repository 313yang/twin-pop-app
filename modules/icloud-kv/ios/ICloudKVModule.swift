import ExpoModulesCore

/// NSUbiquitousKeyValueStore 브리지: iCloud 로그인만 되어 있으면 별도 로그인 없이 기기 간 동기화
public class ICloudKVModule: Module {
  private var observer: NSObjectProtocol?
  private var store: NSUbiquitousKeyValueStore { NSUbiquitousKeyValueStore.default }

  public func definition() -> ModuleDefinition {
    Name("ICloudKV")
    Events("onChange")

    Function("isAvailable") { () -> Bool in
      FileManager.default.ubiquityIdentityToken != nil
    }
    Function("getString") { (key: String) -> String? in
      self.store.string(forKey: key)
    }
    Function("setString") { (key: String, value: String) in
      self.store.set(value, forKey: key)
      self.store.synchronize()
    }
    Function("synchronize") { () -> Bool in
      self.store.synchronize()
    }

    OnStartObserving {
      self.observer = NotificationCenter.default.addObserver(
        forName: NSUbiquitousKeyValueStore.didChangeExternallyNotification,
        object: self.store, queue: .main
      ) { [weak self] note in
        let keys = note.userInfo?[NSUbiquitousKeyValueStoreChangedKeysKey] as? [String] ?? []
        self?.sendEvent("onChange", ["keys": keys])
      }
    }
    OnStopObserving {
      if let o = self.observer { NotificationCenter.default.removeObserver(o) }
      self.observer = nil
    }
  }
}
