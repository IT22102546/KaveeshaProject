import express from "express";
import { createBooking, getBookings} from "../controllers/booking.controller.js";


const router = express.Router();

router.post("/create", createBooking);
router.get("/", getBookings);

export default router;
