import { Model, Table, Column, PrimaryKey, AutoIncrement, HasMany, DataType } from 'sequelize-typescript';
import { UserRole } from '../types/UserRole';
import { Post } from '../models/Post';

@Table
export class User extends Model<User> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column username!: string;

  @Column email!: string;

  @Column password!: string;

  @Column(DataType.STRING) role!: UserRole;

  @HasMany(() => Post) posts: Post[];

}
