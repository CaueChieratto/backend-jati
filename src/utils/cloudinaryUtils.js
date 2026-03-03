const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicIdFromUrl = (url, isRaw = false) => {
  if (!url) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let path = parts[1];

    if (path.match(/^v\d+\//)) {
      path = path.split("/").slice(1).join("/");
    }

    if (isRaw) {
      return path;
    }

    const lastDotIndex = path.lastIndexOf(".");
    return lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;
  } catch (error) {
    console.error("Erro ao extrair public_id:", error);
    return null;
  }
};

const deletarArquivoCloudinary = async (url, isRaw = false) => {
  try {
    const publicId = getPublicIdFromUrl(url, isRaw);

    if (publicId) {
      const options = isRaw ? { resource_type: "raw" } : {};

      const resultado = await cloudinary.uploader.destroy(publicId, options);
      console.log(
        `Cloudinary apagado: ${publicId} | Resultado:`,
        resultado.result,
      );
    }
  } catch (error) {
    console.error(`Erro ao deletar arquivo do Cloudinary (${url}):`, error);
  }
};

module.exports = { deletarArquivoCloudinary };
