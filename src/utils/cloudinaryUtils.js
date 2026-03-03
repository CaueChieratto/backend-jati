const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let path = parts[1];
    if (path.match(/^v\d+\//)) {
      path = path.split("/").slice(1).join("/");
    }

    return path.substring(0, path.lastIndexOf("."));
  } catch (error) {
    console.error("Erro ao extrair public_id:", error);
    return null;
  }
};

const deletarArquivoCloudinary = async (url, isRaw = false) => {
  try {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
      console.log(`Tentando deletar URL: ${url} | Public ID: ${publicId}`);
      const options = isRaw ? { resource_type: "raw" } : {};
      await cloudinary.uploader.destroy(publicId, options);
      console.log(`Arquivo deletado do Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error(`Erro ao deletar arquivo do Cloudinary (${url}):`, error);
  }
};

module.exports = { deletarArquivoCloudinary };
