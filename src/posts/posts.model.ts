import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { z } from 'zod';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  email: string;

  @Column('varchar', { nullable: false })
  content: string;

  @Column('varchar', { nullable: false })
  author: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export const GetPostsSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((data) => !isNaN(Number(data)), 'id must be a numeric value')
      .transform(Number)
      .refine((num) => num > 0, 'id must be a positive number'),
  }),
});
