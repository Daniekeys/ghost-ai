import { auth, currentUser } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";
import { getLiveblocksClient, getCursorColor } from "@/lib/liveblocks";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let projectId: string;
  try {
    const body = await request.json();
    if (typeof body?.projectId !== "string" || !body.projectId.trim()) {
      return Response.json({ error: "projectId is required" }, { status: 400 });
    }
    projectId = body.projectId.trim();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? null;

  const access = await checkProjectAccess(projectId, userId, userEmail);
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const name =
    user?.fullName ??
    user?.firstName ??
    userEmail ??
    "Anonymous";
  const avatar = user?.imageUrl ?? "";
  const color = getCursorColor(userId);

  const liveblocks = getLiveblocksClient();

  await liveblocks.getOrCreateRoom(projectId, {
    defaultAccesses: [],
    usersAccesses: {
      [userId]: ["room:write"],
    },
  });

  const { status, body } = await liveblocks.identifyUser(
    { userId, groupIds: [] },
    { userInfo: { name, avatar, color } }
  );

  return new Response(body, { status });
}
