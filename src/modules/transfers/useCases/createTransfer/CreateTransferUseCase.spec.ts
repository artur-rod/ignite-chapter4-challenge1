import { v4 as uuidV4 } from "uuid"
import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { User } from "../../../users/entities/User"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryTransfersRepository } from "../../repositories/implementations/InMemoryTransfersRepository"
import { CreateTransferUseCase } from "./CreateTransferUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

describe("Create Transfer Use Case", () => {
  let usersRepository: InMemoryUsersRepository
  let statementsRepository: InMemoryStatementsRepository
  let transfersRepository: InMemoryTransfersRepository

  let createTransferUseCase: CreateTransferUseCase

  let recipientUser: User
  let senderUser: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    transfersRepository = new InMemoryTransfersRepository()

    createTransferUseCase = new CreateTransferUseCase(
      transfersRepository, 
      usersRepository, 
      statementsRepository
    )

    recipientUser = await usersRepository.create({
      name: "Recipient Name",
      email: "recipient@email.com",
      password: "recipientPassword"
    })

    senderUser = await usersRepository.create({
      name: "Sender Name",
      email: "sender@email.com",
      password: "senderPassword"
    })

    await statementsRepository.create({
      amount: 300,
      description: "Test Deposit",
      type: "deposit" as OperationType,
      user_id: senderUser.id as string
    })
  })

  it("should be able to create a transfer", async () => {
    const spyFindUser = jest.spyOn(usersRepository, "findById") 
    const spyGetBalance = jest.spyOn(statementsRepository, "getUserBalance")
    const spyCreateTransfer = jest.spyOn(transfersRepository, "create")
    
    const transfer = await createTransferUseCase.execute({
      recipient_id: recipientUser.id as string,
      sender_id: senderUser.id as string,
      amount: 200,
      description: "Test Transfer"
    })

    expect(spyFindUser).toHaveBeenCalled()
    expect(spyGetBalance).toHaveBeenCalled()
    expect(spyCreateTransfer).toHaveBeenCalled()

    expect(transfer).toHaveProperty("id")
  })

  it("should not be able to create a transfer to a inexistent user", async () => {
    await expect(
      createTransferUseCase.execute({
        recipient_id: uuidV4(),
        sender_id: senderUser.id as string,
        amount: 200,
        description: "Test Transfer"
      })
    ).rejects.toEqual(new AppError("Recipient not found"))
  })

  it("should not be able to create a transfer if the sender has insufficient funds", async () => {
    await expect(
      createTransferUseCase.execute({
        recipient_id: recipientUser.id as string,
        sender_id: senderUser.id as string,
        amount: 400,
        description: "Test Transfer"
      })
    ).rejects.toEqual(new AppError("Insufficient funds"))
  })
})