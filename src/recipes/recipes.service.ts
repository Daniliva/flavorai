import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.recipe.findMany({
      where: search ? { title: { contains: search, mode: 'insensitive' } } : {},
      include: {
        user: { select: { email: true } },
        ratings: { select: { stars: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        ratings: { select: { stars: true, user: { select: { email: true } } } },
      },
    });
  }

  async findMy(userId: number) {
    return this.prisma.recipe.findMany({
      where: { userId },
      include: { ratings: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    title: string;
    ingredients: string;
    instructions: string;
    userId: number;
  }) {
    return this.prisma.recipe.create({ data });
  }

  async rate(userId: number, recipeId: number, stars: number) {
    if (stars < 1 || stars > 5) throw new Error('Rating must be 1-5');

    return this.prisma.rating.upsert({
      where: { userId_recipeId: { userId, recipeId } },
      update: { stars },
      create: { userId, recipeId, stars },
    });
  }
}