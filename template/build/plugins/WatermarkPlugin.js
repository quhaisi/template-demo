const fs = require('fs');

class WatermarkPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('WatermarkPlugin', (compilation, callback) => {
      const { watermarkText } = this.options;

      // 获取生成的文件列表
      const assets = compilation.assets;

      Object.keys(assets).forEach(fileName => {
        if (fileName.endsWith('.html')) {
          const source = assets[fileName].source();
          const watermarkedSource = this.addWatermarkToHTML(source, watermarkText);
          compilation.assets[fileName] = {
            source: () => watermarkedSource,
            size: () => Buffer.byteLength(watermarkedSource)
          };
        }
      });

      callback();
    });
  }

  addWatermarkToHTML(html, watermarkText) {
    const watermarkDiv = `<div style="position: absolute; bottom: 0; right: 0; opacity: 0.5; color: gray; font-size: 12px;">${watermarkText}</div>`;
    return html.replace('</body>', `${watermarkDiv}\n</body>`);
  }
}

module.exports = WatermarkPlugin;