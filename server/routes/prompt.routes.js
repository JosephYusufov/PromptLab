import express from 'express'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'
import promptCtrl from '../controllers/prompt.controller'

const router = express.Router()

router.route('/api/prompts/user/:userId')
  // .get(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.create)
  // .put(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.update)
  // .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.remove)

router.param('userId', userCtrl.userByID)

export default router