const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * CreditGo Android Size Optimization Plugin
 * Enables Proguard, R8 shrinking, and ABI splits for smaller APK size
 */

const withAndroidSizeOptimization = (config) => {
  // Modify app/build.gradle
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      // Add optimization settings to buildTypes.release
      const buildGradle = config.modResults.contents;
      
      // Check if optimizations already added
      if (!buildGradle.includes('// CreditGo Size Optimizations')) {
        // Find the release buildType and add optimizations
        const releasePattern = /buildTypes\s*\{[\s\S]*?release\s*\{/;
        
        if (releasePattern.test(buildGradle)) {
          config.modResults.contents = buildGradle.replace(
            releasePattern,
            (match) => `${match}
            // CreditGo Size Optimizations
            shrinkResources true
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"`
          );
        }
      }
      
      // Add ABI splits configuration if not present
      if (!buildGradle.includes('splits {') && !config.modResults.contents.includes('splits {')) {
        const androidBlock = /android\s*\{/;
        if (androidBlock.test(config.modResults.contents)) {
          config.modResults.contents = config.modResults.contents.replace(
            /android\s*\{/,
            `android {
    // ABI Splits for smaller APK per architecture
    splits {
        abi {
            enable gradle.startParameter.taskNames.any { it.contains("Release") }
            reset()
            include "armeabi-v7a", "arm64-v8a"
            universalApk false
        }
    }
    
    packagingOptions {
        resources {
            excludes += ['META-INF/NOTICE', 'META-INF/LICENSE', 'META-INF/*.kotlin_module']
        }
    }`
          );
        }
      }
    }
    return config;
  });

  return config;
};

module.exports = withAndroidSizeOptimization;
