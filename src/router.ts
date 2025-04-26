import { Router } from 'express'
import { createAccount } from './handlers'

const router = Router()

// Routing
// Autenticacion y Registro
router.post('/auth/register', createAccount)

export default router