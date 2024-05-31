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

export const CreatePostsSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .trim()
      .min(1, 'Name cannot be empty'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .trim()
      .min(1, 'Email cannot be empty')
      .email('Invalid email'),
    content: z
      .string({
        required_error: 'Content is required',
      })
      .trim()
      .min(1, 'Content cannot be empty'),
    author: z
      .string({
        required_error: 'Author is required',
      })
      .trim()
      .min(1, 'Author cannot be empty'),
  }),
});

export const UpdatePostsSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((data) => !isNaN(Number(data)), 'id must be a numeric value')
      .transform(Number)
      .refine((num) => num > 0, 'id must be a positive number'),
  }),
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .trim()
      .min(1, 'Name cannot be empty'),
    content: z
      .string({
        required_error: 'Content is required',
      })
      .trim()
      .min(1, 'Content cannot be empty'),
  }),
});
