const fs = require('fs');

fs.writeFile('output.txt', 'Hello Async Node.js', (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("File written successfully");
});