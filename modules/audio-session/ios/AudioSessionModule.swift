import ExpoModulesCore
import AVFoundation

/// 다른 앱(애플뮤직·스포티파이 등)의 음악 재생 여부 감지
public class AudioSessionModule: Module {
  private var observer: NSObjectProtocol?

  public func definition() -> ModuleDefinition {
    Name("AudioSession")
    Events("onOtherAudioChange")

    Function("isOtherAudioPlaying") { () -> Bool in
      AVAudioSession.sharedInstance().isOtherAudioPlaying
    }

    OnStartObserving {
      self.observer = NotificationCenter.default.addObserver(
        forName: AVAudioSession.silenceSecondaryAudioHintNotification, object: nil, queue: .main
      ) { [weak self] _ in
        self?.sendEvent("onOtherAudioChange", ["playing": AVAudioSession.sharedInstance().isOtherAudioPlaying])
      }
    }
    OnStopObserving {
      if let o = self.observer { NotificationCenter.default.removeObserver(o) }
      self.observer = nil
    }
  }
}
