var colors = require('colors');

const logInfo = (...str : any[]) => {
  console.log(colors.blue(...str));   
}

const logSuccess = (...str : any[]) => {
    console.log(colors.green(...str));   
}

const logWarning = (...str : any[]) => {
    console.log(colors.yellow(...str));   
}

const logError = (...str : any[]) => {
    console.log(colors.red(...str));   
}

export {
    logInfo,
    logSuccess,
    logWarning,
    logError,
}