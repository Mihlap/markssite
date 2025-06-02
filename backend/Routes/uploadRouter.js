const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/HEIC',
  'image/avif',
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/MOV',
  'application/pdf',
]);

module.exports = async function uploadRouter(fastify, options) {
  fastify.post('/submitImages', async (request, reply) => {
    // Сначала распарсим все файлы в request.body
    await request.saveRequestFiles();
 
    const {
      dropPhoto = [],
      photoAva = [],
      imageOpen = [],
      imageClose = [],
      dynamicImages = [],
    } = request.body;
 
    const parts = [...dropPhoto, ...photoAva, ...imageOpen, ...imageClose, ...dynamicImages];

    const uploaded = await Promise.all(
      parts
        .filter((part) => part.file && ALLOWED_MIME_TYPES.has(part.mimetype))
        .map(async (part) => {
          const buf = await part.toBuffer();
          return fastify.uploadFileToS3(
            {
              buffer: buf,
              originalname: part.filename,
              mimetype: part.mimetype,
            },
            'images',
          );
        }),
    );

    return reply.send({ uploaded });
  });
};
