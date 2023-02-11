import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createTransferUseCase = container.resolve(CreateTransferUseCase)

    const { amount, description } = request.body
    const { user_id: recipient_id } = request.params
    const { id: sender_id } = request.user

    const transfer = await createTransferUseCase.execute({ 
      recipient_id, 
      sender_id, 
      amount, 
      description
    })

    return response.status(201).json(transfer)
  }
}

export { CreateTransferController };
