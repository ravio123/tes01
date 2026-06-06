const sharp = require('sharp');

const sizes = [48,72,96,144,192];
const names = ['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi'];

(async () => {
  for(let i=0;i<sizes.length;i++){
    await sharp('assets/icon.png')
      .resize(sizes[i], sizes[i])
      .toFile(`temp-icons/${names[i]}.png`);
  }
})();
