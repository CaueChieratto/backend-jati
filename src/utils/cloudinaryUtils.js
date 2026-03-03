const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    const uploadSplit = url.split("/upload/");
    if (uploadSplit.length < 2) return null;

    let path = uploadSplit[1];
    path = path.split("?")[0];

    if (path.startsWith("v") && path[1] >= "0" && path[1] <= "9") {
      const parts = path.split("/");
      parts.shift();
      path = parts.join("/");
    }

    const lastDotIndex = path.lastIndexOf(".");
    const publicId =
      lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;

    return publicId;
  } catch {
    return null;
  }
};

const deletarArquivoCloudinary = async (url, isRaw = false) => {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "Erro no Backend: CLOUDINARY_API_KEY ou API_SECRET estão ausentes no .env!",
    );
  }

  const publicId = getPublicIdFromUrl(url);
  if (!publicId) {
    throw new Error(
      `Erro interno: Não foi possível extrair o ID do Cloudinary da URL: ${url}`,
    );
  }

  const options = isRaw ? { resource_type: "raw" } : {};

  try {
    const resposta = await cloudinary.uploader.destroy(publicId, options);

    if (resposta.result !== "ok") {
      throw new Error(
        `Cloudinary não apagou. result="${resposta.result}", public_id="${publicId}", resource_type="${options.resource_type || "image"}"`,
      );
    }

    return {
      urlOriginal: url,
      publicId,
      options,
      resposta,
    };
  } catch (error) {
    throw new Error(
      `Falha na API do Cloudinary ao apagar "${url}" (public_id: "${publicId}"): ${error.message}`,
    );
  }
};

module.exports = { deletarArquivoCloudinary };
