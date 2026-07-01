import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router()

router.post("/init-payment/:bookingId", paymentController.initPayment)
router.post("/success", paymentController.paymentSuccess)
router.post("/fail", paymentController.paymentFail)
router.post("/cancel", paymentController.paymentCancel)

export const PaymentRoutes = router