import slug from 'slug'
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { validationResult } from 'express-validator'
import { generateJWT } from '../utils/jwt'

export const createAccount = async (req, res) => {

    const { email, password, handle } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('El usuario ya esta registrado')
        return res.status(409).json({ error: error.message })
    }

    const handleSlug = slug(handle, '')
    const handleExists = await User.findOne({ handle: handleSlug })
    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).json({ error: error.message })
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handleSlug

    await user.save()

    res.status(201).send({ msg: 'Registro Creado Correctamente' })
}

export const login = async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if(!user) {
        const errors = new Error('El usuario no existe')
        return res.status(404).json({error: errors.message})
    }

    // Comprobar el password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if(!isPasswordCorrect) {
        const error = new Error('Password Incorrecto')
        return res.status(401).json({error: error.message})
    }

    generateJWT(user)

    res.send('Autenticando...')
}