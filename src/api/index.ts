import express, { Request } from 'express';
import multer, { StorageEngine } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { authUser } from '../middleware/auth';
import UserCtrl from '../controllers/user.controller';

const storage: StorageEngine = multer.diskStorage({
  destination: async function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const fileName = uuidv4();
    cb(null, fileName + '.jpg');
  }
});

const upload = multer({ storage: storage })
const router = express.Router();

router.route("/login")
  .post(UserCtrl.handleLoginUser)

router.route("/register")
  .post(UserCtrl.handleCreateUser)
  
router.route("/user")
  .all(authUser)
  .get(UserCtrl.handleLoadUsers)
  .put(UserCtrl.handleChangePassword)
  .delete(UserCtrl.handleDeleteUser)

export default router;