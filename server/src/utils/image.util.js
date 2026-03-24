import sharp from "sharp";

const processAvatarImage = async (file) => ({
  buffer: await sharp(file.buffer)
    .rotate()
    .resize(512, 512, { fit: "cover" })
    .webp({ quality: 80 })
    .toBuffer(),
  contentType: "image/webp",
});

const processLogoImage = async (file) => ({
  buffer: await sharp(file.buffer)
    .rotate()
    .resize(512, 512, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .webp({ quality: 85 })
    .toBuffer(),
  contentType: "image/webp",
});

export { processAvatarImage, processLogoImage };
