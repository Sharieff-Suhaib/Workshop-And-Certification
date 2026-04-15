import { Router } from "express";
import {
  listWorkshops,
  getWorkshop,
  registerForWorkshop,
  getMyRegistrations,
} from "../controllers/workshopController";

const router = Router();

// ─── PUBLIC ROUTES ─────────────────────────────
router.get("/", listWorkshops);
router.get("/:id", getWorkshop);

router.post("/:id/register", registerForWorkshop);

router.get("/my-registrations", getMyRegistrations);

export default router;