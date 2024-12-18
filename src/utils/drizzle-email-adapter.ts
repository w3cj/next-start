import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { createHash } from "crypto";
import type { Adapter } from "next-auth/adapters";

type Params = Parameters<typeof DrizzleAdapter>;
type SqlFlavor = Params[0];
type Schema = Params[1];

export interface GravatarProfile {
  display_name: string;
  avatar_url: string;
}

export function DrizzleEmailAdapter(db: SqlFlavor, schema?: Schema): Adapter {
  const baseAdapter = DrizzleAdapter(db, schema);

  type User = Parameters<NonNullable<(typeof baseAdapter)["createUser"]>>[0];

  return {
    ...baseAdapter,
    createUser: async (data: User) => {
      const hash = createHash("sha256").update(data.email).digest("hex");
      const response = await fetch(
        `https://api.gravatar.com/v3/profiles/${hash}`
      );
      if (response.ok) {
        const json: GravatarProfile = await response.json();
        data.image = json.avatar_url;
        data.name = json.display_name;
      } else {
        const name = data.email.split("@")[0];
        data.image = `https://ui-avatars.com/api/?name=${name}`;
        data.name = name;
      }

      return baseAdapter.createUser!(data);
    },
  };
}
