import { Router } from "express";
import { CreateTransferController } from "../modules/transfers/useCases/createTransfer/CreateTransferController";
import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';

const transfersRoutes = Router()

const createTransferController = new CreateTransferController()

transfersRoutes.post("/:user_id", ensureAuthenticated, createTransferController.handle)

export { transfersRoutes };
