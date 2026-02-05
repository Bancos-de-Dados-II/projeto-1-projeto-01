/**
 * @swagger
 * tags:
 *   name: Institution
 *   description: Endpoints de gerenciamento de instituições
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateInstitution:
 *       type: object
 *       required:
 *         - name
 *         - cnpj
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: Universidade Federal
 *         cnpj:
 *           type: string
 *           example: 12.345.678/0001-90
 *         email:
 *           type: string
 *           example: contato@uf.edu.br
 *         phone:
 *           type: string
 *           example: "(11) 99999-9999"
 *         address:
 *           type: string
 *           example: Rua das Flores, 123
 *         active:
 *           type: boolean
 *           example: true
 *         latitude:
 *           type: number
 *           example: -23.55052
 *         longitude:
 *           type: number
 *           example: -46.633308
 */

/**
 * @swagger
 * /institution:
 *   post:
 *     summary: Cadastra uma nova instituição
 *     tags: [Institution]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstitution'
 *     responses:
 *       201:
 *         description: Instituição criada com sucesso
 *       400:
 *         description: Erro de validação
 */

/**
 * @swagger
 * /institution:
 *   get:
 *     summary: Lista todas as instituições
 *     tags: [Institution]
 *     responses:
 *       200:
 *         description: Lista de instituições
 */

/**
 * @swagger
 * /institution/{id}:
 *   get:
 *     summary: Busca instituição por ID
 *     tags: [Institution]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instituição encontrada
 *       404:
 *         description: Instituição não encontrada
 */

/**
 * @swagger
 * /institution/{id}:
 *   put:
 *     summary: Atualiza uma instituição
 *     tags: [Institution]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstitution'
 *     responses:
 *       200:
 *         description: Instituição atualizada
 */

/**
 * @swagger
 * /institution/{id}:
 *   delete:
 *     summary: Remove uma instituição
 *     tags: [Institution]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instituição removida
 */
