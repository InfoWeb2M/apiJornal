/**
 * @swagger
 * /news:
 *   get:
 *     summary: Listar notícias
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Lista de notícias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 */
