const fs = require('fs');
fs.readFile('./dist/index.js', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const modifiedData = `global.self = global;\n${data}`;
  fs.writeFile('./dist/index.js', modifiedData, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('postbuild script executed successfully!');
  });
});
