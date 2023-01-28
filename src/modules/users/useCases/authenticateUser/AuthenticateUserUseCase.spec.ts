import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

describe("Authenticate User Use Case", () => {
  let authenticateUserUseCase: AuthenticateUserUseCase
  let createUserUseCase: CreateUserUseCase
  let usersRepository: InMemoryUsersRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("Should be able to authenticate a existent user", async () => {
    const user = {
      name: "Name Lastname",
      email: "name.lastname@email.com",
      password: "Password123"
    }
    
    const createUser = await createUserUseCase.execute(user)

    const authenticateUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(authenticateUser).toHaveProperty("token")
    expect(authenticateUser.user.id).toBe(createUser.id)
  })

  it("Should not be able to authenticate a user with an incorrect password", () => {
    expect(async () => {
      const user = {
        name: "Name Lastname",
        email: "name.lastname@email.com",
        password: "Password123"
      }
      
      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to authenticate a nonexistent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "nonexistent@email.com",
        password: "nonexistentPassword"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})