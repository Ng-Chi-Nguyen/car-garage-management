import { createClient } from "@supabase/supabase-js";

import { buildServiceError } from "../shared/crud/crud.helpers.js";

let supabaseAdminClient;

const getSupabaseUrl = () => process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

const getSupabaseServiceRoleKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

const getSupabaseAdminClient = () => {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseServiceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw buildServiceError(500, "Thiếu cấu hình Supabase Storage ở server.");
  }

  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return supabaseAdminClient;
};

const uploadPublicImage = async ({ bucket, path, buffer, contentType }) => {
  const client = getSupabaseAdminClient();
  const { error } = await client.storage.from(bucket).upload(path, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw buildServiceError(500, `Upload ảnh lên Supabase thất bại: ${error.message}`);
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

const removeObject = async ({ bucket, path }) => {
  const client = getSupabaseAdminClient();
  const { error } = await client.storage.from(bucket).remove([path]);

  if (error) {
    throw buildServiceError(500, `Xóa ảnh trên Supabase thất bại: ${error.message}`);
  }
};

const resolveStorageObjectFromPublicUrl = (publicUrl) => {
  if (!publicUrl) {
    return null;
  }

  const url = new URL(publicUrl);
  const publicMarker = "/storage/v1/object/public/";
  const markerIndex = url.pathname.indexOf(publicMarker);

  if (markerIndex === -1) {
    throw buildServiceError(500, "URL ảnh Supabase không hợp lệ.");
  }

  const storagePath = url.pathname.slice(markerIndex + publicMarker.length);
  const [bucket, ...pathParts] = storagePath.split("/");

  if (!bucket || pathParts.length === 0) {
    throw buildServiceError(500, "Không thể xác định đường dẫn ảnh trên Supabase.");
  }

  return {
    bucket,
    path: pathParts.join("/"),
  };
};

export { removeObject, resolveStorageObjectFromPublicUrl, uploadPublicImage };
