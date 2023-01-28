import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

describe("Get Balance Use Case", () => {
  let usersRepository: InMemoryUsersRepository
  let statementsRepository: InMemoryStatementsRepository
  let getBalanceUseCase: GetBalanceUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  })

  it("Should be able to get a user balance", async () => {
    const user = await usersRepository.create({
      name: "Name Lastname", 
      email: "name.lastname@email.com", 
      password: "password123"
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