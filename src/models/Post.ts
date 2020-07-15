import { Model, Table, Column, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../models/User';

@Table
export class Post extends Model<Post> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column text!: string;

  @ForeignKey(() => User) @Column userId!: number;
  
  @BelongsTo(() => User) user: User;
}
