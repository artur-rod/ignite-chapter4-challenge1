import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import { User } from "../../../users/entities/User";
import { UsersRepository } from "../../../users/repositories/UsersRepository";

describe("Create Transfer Controller", () => {
  let database: Connection
  let token: string

  let recipientUser: User
  let senderUser: User

  beforeAll(async () => {
    database = await createConnection()
    await database.runMigrations()
    const usersRepository = new UsersRepository() 

    await request(app).post("/api/v1/users").send({
      name: "Recipient Name",
      email: "recipient@email.com",
      password: "password123"
    })

    await request(app).post("/api/v1/users").send({
      name: "Sender Name",
      email: "sender@email.com",
      password: "password123"
    }) 

    recipientUser = await usersRepository.findByEmail("recipient@email.com") as User
    senderUser = await usersRepository.findByEmail("sender@email.com") as User

    const authenticate = await request(app).post("/api/v1/sessions").send({
      email: "sender@email.com",
      password: "password123"
    })
    
    token = authenticate.body.token
    expect(token).toBeDefined()
  })

  afterAll(async () => {
    await database.dropDatabase()
    await database.close()
  })

  it("should create a new Transfer", async () => {
    await request(app).post("/api/v1/statements/deposit").send({
      amount: 200,
      description: "Deposit Test"
    }).set({
      Authorization: `Bearer ${token}`
    })

    const response = await request(app)
      .post(`/api/v1/transfers/${recipientUser.id}`)
      .send({
        amount: 100,
        description: "Test transfer"
      }).set({
        Authorization: `Bearer ${token}`
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty("id")
  })
})