import { Router } from 'express'
const usersRouter = Router();
import multer from 'multer'
import uploadConfig from '../config/upload'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import CreateUserService from '../services/CreateUserServices'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'


const upload = multer(uploadConfig)

usersRouter.post('/', async (request, response) => {

    const { name, password, repassword, email } = request.body
    const createUser = new CreateUserService()

    if ( password !== repassword ) {
        return response.json({error: "This password don't match"})
    }
    
    const user = await createUser.execute({
        email, 
        name, 
        password
    })

    // @ts-expect-error
    delete user.password

    return response.json(user)

})

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar') ,async(request, response) => {

    const updateUserAvatar = new UpdateUserAvatarService()

    const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename
    })

    // @ts-expect-error
    delete user.password

    return response.json(user)
} )

export default usersRouter;
