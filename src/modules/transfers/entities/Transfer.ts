import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { User } from "../../users/entities/User";

@Entity("transfers")
class Transfer {
  constructor () {
    if (!this.id) this.id = uuidV4()
  }

  @PrimaryColumn()
  id: string

  @Column()
  user_id: string

  @ManyToOne(() => User, user => user.transfers)
  @JoinColumn({ name: "user_id" })
  user: User

  @Column()
  sender_id: string

  @Column()
  amount: number

  @Column()
  description: string

  @Column()
  type: string

  @CreateDateColumn()
  created_at: Date
  
  @UpdateDateColumn()
  updated_at: Date
}

export { Transfer };
