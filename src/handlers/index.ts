import { Request, Response } from 'express'
import slug from 'slug'
import formidable from 'formidable'
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from '../utils/jwt'
import cloudinary from '../config/cloudinary'

export const createAccount = async (req: Request, res: Response) => {

    const { email, password, handle } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('El usuario ya esta registrado')
        res.status(409).json({ error: error.message })
    }

    const handleSlug = slug(handle, '')
    const handleExists = await User.findOne({ handle: handleSlug })
    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible')
        res.status(409).json({ error: error.message })
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handleSlug

    await user.save()

    res.status(201).send({ msg: 'Registro Creado Correctamente' })
}

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        const errors = new Error('El usuario no existe')
        res.status(404).json({ error: errors.message })
    }

    // Comprobar el password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('Password Incorrecto')
        res.status(401).json({ error: error.message })
    }

    const token = generateJWT({ id: user._id })

    res.send(token)
}

export const getUser = async (req: Request, res: Response) => {

    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description } = req.body
        const handleSlug = slug(req.body.handle, '')
        const handleExists = await User.findOne({ handle: handleSlug })
        if (handleExists && handleExists.email !== req.user.email) {
            const error = new Error('Nombre de usuario no disponible')
            res.status(409).json({ error: error.message })
        }

        req.user.description = description
        req.user.handle = handleSlug

        await req.user.save()

        res.send('Actualizado correctamente')
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({ error: error.message })
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false })
    try {
        form.parse(req, (error, fields, files) => {
            cloudinary.uploader.upload(files.file[0].filepath, {}, async function (error, result) {
                if (error) {
                    const error = new Error('Hubo un error al subir la imagen')
                    res.status(500).json({ error: error.message })
                }
                if(result) {
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({image: result.secure_url})
                }
            })
        })
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({ error: error.message })
    }
}