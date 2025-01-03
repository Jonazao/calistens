import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';
import { Role } from '../enums/roles.enum';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER }) // Role column
  role: Role;
}
