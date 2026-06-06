import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabase = createClient(
  "https://nlwkksivgubcgfzqivcs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sd2trc2l2Z3ViY2dmenFpdmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjI1NTUsImV4cCI6MjA5NTUzODU1NX0.Z0rNzhIAxUVG33c4hnj4bNWPwDGbqV-WnWPkixnUzUI"
);

const IMAGES_DIR = "C:/Users/vardi/source/talis-flower-images";

const files = [
  { path: "WhatsApp Image 2026-05-30 at 13.34.00.jpeg",     name: "bus-jerusalem-panorama.jpeg" },
  { path: "WhatsApp Image 2026-05-30 at 13.34.00 (1).jpeg", name: "minibus-jerusalem.jpeg" },
  { path: "WhatsApp Image 2026-05-30 at 13.34.00 (2).jpeg", name: "bus-wedding-night.jpeg" },
  { path: "WhatsApp Image 2026-05-30 at 13.34.00 (3).jpeg", name: "bus-interior-seats.jpeg" },
];

for (const f of files) {
  const buffer = readFileSync(join(IMAGES_DIR, f.path));
  const { error } = await supabase.storage
    .from("site-images")
    .upload(f.name, buffer, { contentType: "image/jpeg", upsert: true });

  if (error) {
    console.error(`❌ ${f.name}:`, error.message);
  } else {
    const { data } = supabase.storage.from("site-images").getPublicUrl(f.name);
    console.log(`✅ ${f.name}`);
    console.log(`   ${data.publicUrl}`);
  }
}
