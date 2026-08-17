import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
// @ts-ignore
import { api } from "../../../../../convex/_generated/api";
// @ts-ignore
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// GET single todo by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const todo = await convex.query(api.todos.getTodoById, { id: resolvedParams.id as Id<"todos"> });
    
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    return NextResponse.json(todo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a todo
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // Support toggleComplete separately or inline
    if (typeof body.completed === "boolean") {
      await convex.mutation(api.todos.toggleComplete, {
        id: resolvedParams.id as Id<"todos">,
        completed: body.completed,
      });
    }

    // Update other fields
    if (body.title || body.description || body.priority || body.dueDate) {
      await convex.mutation(api.todos.updateTodo, {
        id: resolvedParams.id as Id<"todos">,
        title: body.title,
        description: body.description,
        dueDate: body.dueDate,
        priority: body.priority,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a todo
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await convex.mutation(api.todos.deleteTodo, { id: resolvedParams.id as Id<"todos"> });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
