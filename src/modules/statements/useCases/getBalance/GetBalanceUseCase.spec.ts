import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryTransfersRepository } from "../../../transfers/repositories/implementations/InMemoryTransfersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = "transfer"
}

describe("Get Balance Use Case", () => {
  let usersRepository: InMemoryUsersRepository
  let statementsRepository: InMemoryStatementsRepository
  let transfersRepository: InMemoryTransfersRepository
  let getBalanceUseCase: GetBalanceUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    transfersRepository = new InMemoryTransfersRepository()

    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository, 
      usersRepository, 
      transfersRepository
    )
  })

  it("Should be able to get a user balance", async () => {
    const user = await usersRepository.create({
      name: "Name Lastname", 
      email: "name.lastname@email.com", 
      password: "password123"
    })
    
    const recipient = await usersRepository.create({
      name: "Recipient", 
      email: "recipient@email.com", 
      password: "password123"
    })

    await statementsRepository.create({
      amount: 500,
      description: "Test",
      type: "deposit" as OperationType,
      user_id: user.id as string
    })

    await transfersRepository.create({
      recipient_id: recipient.id as string,
      sender_id: user.id as string,
      amount: 400,
      description: "test"
    })

    const balance = await getBalanceUseCase.execute({user_id: user.id as string})

    expect(balance).toHaveProperty("statement")
    expect(balance).toHaveProperty("balance")
  })

  it("Should not be able to get a nonexistent user balance", () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: "nonexistentId"})
    }).rejects.toBeInstanceOf(AppError)
  })
})