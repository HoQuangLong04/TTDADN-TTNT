// // services/pythonRunner.js
// const { spawn } = require('child_process');

// function runPythonScript(scriptPath, args = []) {
//   return new Promise((resolve, reject) => {
//     const pyProcess = spawn('python', [scriptPath, ...args]);

//     let output = '';
//     let errorOutput = '';

//     pyProcess.stdout.on('data', (data) => {
//       output += data.toString();
//     });

//     pyProcess.stderr.on('data', (data) => {
//       errorOutput += data.toString();
//     });

//     pyProcess.on('close', (code) => {
//       if (code === 0) {
//         resolve(output);
//       } else {
//         reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
//       }
//     });
//   });
// }

// module.exports = { runPythonScript };
