/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Buscar notícia por ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único da notícia
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notícia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: Notícia não encontrada
 */
