module.exports = (appName, envVarCoverageToggleName='', pathToRawFiles='', pathToCoveredFiles='') ->  
    return (moduleName) ->      
      envVarCoverageToggleName = "#{appName}_cov" if envVarCoverageToggleName is ''
      pathToRawFiles = "../#{appName}" if pathToRawFiles is ''
      pathToCoveredFiles = "../#{appName}_cov" if pathToCoveredFiles is ''
      modulesPath = if process.env[envVarCoverageToggleName]? then pathToCoveredFiles else pathToRawFiles
      modulePath = "#{modulesPath}/#{moduleName}"
      return require(modulePath)