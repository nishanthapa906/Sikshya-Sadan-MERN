import express from 'express';
 import { authorize, protect } from '../middleware/auth.js';
import { createUser, getAllUsers,  getStats, updateUser, updateUserRole, updateUserStatus } from '../controller/adminController.js';
const router = express.Router();


//All routes are protected and restricted to admin 

// All routes are protected and restricted to admin
// router.use(protect);
// router.use(authorize('admin'));  // after creating admin then make this protect to the admin ok 

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
// router.get('/financial-reports', getFinancialReports);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
// router.put('/enrollments/:id/status', updateEnrollmentPaymentStatus);




export default router;

//enrollments ko baki xa hai course ra enrollement ko kaam garesi ya admin ma garni tyo kura 