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

    const [cleanPath] = path.split("?");

    const lastDotIndex = cleanPath.lastIndexOf(".");
    const withoutExtension =
      lastDotIndex !== -1 ? cleanPath.substring(0, lastDotIndex) : cleanPath;

    return withoutExtension;
  } catch (error) {
    return null;
  }
};

const deletarArquivoCloudinary = async (url, isRaw = false) => {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "Erro no Backend: CLOUDINARY_API_KEY ou API_SECRET estão ausentes no .env!",
    );
  }

  const publicId = getPublicIdFromUrl(url, isRaw);
  if (!publicId) {
    throw new Error(
      `Erro interno: Não foi possível extrair o ID do Cloudinary da URL: ${url}`,
    );
  }

  const options = isRaw ? { resource_type: "raw" } : {};

  try {
    const resposta = await cloudinary.uploader.destroy(publicId, options);

    if (resposta.result !== "ok" && resposta.result !== "not found") {
      throw new Error(
        `Cloudinary recusou apagar o arquivo ${publicId}. Motivo retornado: ${resposta.result}`,
      );
    }

    return resposta;
  } catch (error) {
    throw new Error(
      `Falha na API do Cloudinary ao apagar ${publicId}: ${error.message}`,
    );
  }
};

module.exports = { deletarArquivoCloudinary };
