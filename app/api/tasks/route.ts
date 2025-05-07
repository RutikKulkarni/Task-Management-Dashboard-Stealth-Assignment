import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { TaskStatus } from "@/lib/types";

interface QueryFilter {
  userId: string;
  status?: TaskStatus;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const { db } = await connectToDatabase();

    const query: QueryFilter = { userId: session.user.id };
    if (status && status !== "all") {
      query.status = status as TaskStatus;
    }

    const tasks = await db
      .collection("tasks")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      priority,
      status = "todo",
    } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const newTask = {
      title,
      description,
      priority,
      status,
      userId: session.user.id,
      createdAt: new Date(),
    };

    const result = await db.collection("tasks").insertOne(newTask);
    return NextResponse.json(
      {
        ...newTask,
        _id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
