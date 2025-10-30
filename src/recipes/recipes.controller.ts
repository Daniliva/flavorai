import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  Param,
  ParseIntPipe, BadRequestException,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';

class CreateRecipeDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @ApiProperty({ example: 'Омлет' })
  title: string;

  @ApiProperty({ example: 'яйца, молоко, соль' })
  ingredients: string;

  @ApiProperty({ example: 'Взбить яйца...' })
  instructions: string;
}

class RateRecipeDto {
  @ApiProperty({ example: 1 })
  recipeId: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  stars: number;
}

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private service: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all recipes (with search)' })
  @ApiQuery({ name: 'search', required: false, example: 'омлет' })
  @ApiResponse({ status: 200, description: 'List of recipes' })
  async findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by ID' })
  @ApiResponse({ status: 200 })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({ summary: 'Get my recipes' })
  async findMy(@Request() req) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user ID');
    return this.service.findMy(userId);
    return this.service.findMy(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create new recipe' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @ApiBody({ type: CreateRecipeDto })
  async create(
    @Body() body: { title: string; ingredients: string; instructions: string },
    @Request() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    return this.service.create({ ...body, userId: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('rate')
  @ApiOperation({ summary: 'Rate a recipe' })
  @ApiBody({ type: RateRecipeDto })
  async rate(
    @Body() body: { recipeId: number; stars: number },
    @Request() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.service.rate(req.user.id, body.recipeId, body.stars);
  }
}
