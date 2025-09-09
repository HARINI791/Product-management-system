const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Image processing configuration
const IMAGE_CONFIG = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 80,
  format: 'jpeg'
};

const processImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(IMAGE_CONFIG.maxWidth, IMAGE_CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: IMAGE_CONFIG.quality,
        progressive: true
      })
      .toFile(outputPath);
    
    console.log(`Image processed successfully: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error processing image:', error);
    return false;
  }
};

const processImageBuffer = async (buffer, outputPath) => {
  try {
    await sharp(buffer)
      .resize(IMAGE_CONFIG.maxWidth, IMAGE_CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: IMAGE_CONFIG.quality,
        progressive: true
      })
      .toFile(outputPath);
    
    console.log(`Image processed successfully from buffer: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error processing image from buffer:', error);
    return false;
  }
};

module.exports = {
  processImage,
  processImageBuffer,
  IMAGE_CONFIG
};
