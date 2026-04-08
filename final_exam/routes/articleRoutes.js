const { Router } = require('express');
const articleController = require('../controllers/articleController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/my-articles', requireAuth, articleController.articles_my_get);
router.get('/create', requireAuth, articleController.article_create_get);
router.post('/create', requireAuth, articleController.article_create_post);

router.get('/:id/edit', requireAuth, articleController.article_edit_get);
router.post('/:id/edit', requireAuth, articleController.article_edit_post);
router.post('/:id/delete', requireAuth, articleController.article_delete);

router.get('/:id', articleController.article_single_get); // Public or private based on preference, let's keep it public
router.post('/:id/comments', requireAuth, articleController.comment_post);

module.exports = router;
