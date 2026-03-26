import express from 'express'
import { additem, listitem, removeitem} from '../controllers/itemController.js'
import multer from 'multer'

const itemRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})
itemRouter.post('/add',upload.single('image'),additem)
itemRouter.get('/list',listitem)
itemRouter.post('/remove', removeitem)

export default itemRouter;