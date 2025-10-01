import axios from "axios";

type RobloxUser = {
  requestedUsername: string;
  id: number;
  name: string;
  displayName: string;
};

export async function getUserIdFromUsername(
  username: string,
): Promise<number | null> {
  try {
    const res = await axios.post(
      "https://users.roblox.com/v1/usernames/users",
      {
        usernames: [username],
      },
    );

    const data = res.data?.data as RobloxUser[];
    if (data && data[0] && data[0].id) {
      return data[0].id;
    }
    return null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error getUserIdFromUsername:", err.message);
    } else {
      console.error("Unknown error in getUserIdFromUsername");
    }
    return null;
  }
}

export async function getUserIdsFromUsernames(
  usernames: string[],
): Promise<Record<string, number>> {
  try {
    const res = await axios.post(
      "https://users.roblox.com/v1/usernames/users",
      {
        usernames,
      },
    );

    const data = res.data?.data as RobloxUser[];
    const map: Record<string, number> = {};
    for (const user of data) {
      if (user.id) {
        map[user.requestedUsername] = user.id;
      }
    }
    return map;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error getUserIdsFromUsernames:", err.message);
    } else {
      console.error("Unknown error in getUserIdsFromUsernames");
    }
    return {};
  }
}
