Pod::Spec.new do |s|
  s.name           = 'ICloudKV'
  s.version        = '1.0.0'
  s.summary        = 'iCloud key-value store bridge for TWINPOP'
  s.author         = ''
  s.homepage       = 'https://github.com/313yang/twin-pop-app'
  s.license        = '0BSD'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.swift'
end
