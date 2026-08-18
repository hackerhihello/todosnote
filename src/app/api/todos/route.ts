import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
// @ts-ignore
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// GET all todos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");

    if (searchTerm) {
      const searchResults = await convex.query(api.todos.searchTodos, { searchTerm });
      return NextResponse.json(searchResults);
    }

    const filterValue = searchParams.get("filter");
    const sortValue = searchParams.get("sort");

    const filter = filterValue ? (filterValue as "All" | "Active" | "Completed") : undefined;
    const sort = sortValue ? (sortValue as "Newest First" | "Oldest First") : undefined;

    const todos = await convex.query(api.todos.getTodos, { filter, sort });
    return NextResponse.json(todos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a new todo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    
    if (!["Low", "Medium", "High"].includes(body.priority || "Medium")) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }

    const todoId = await convex.mutation(api.todos.createTodo, {
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      priority: body.priority || "Medium",
    });

    return NextResponse.json({ success: true, id: todoId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
