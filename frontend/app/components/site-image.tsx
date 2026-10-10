import Image, { type ImageProps } from "next/image";

const managedMediaPath = /^\/site-media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function SiteImage(props: ImageProps) {
  // Node standalone's optimizer only reads static build files. CMS images
  // must use the existing public media route, which enforces publication access.
  const managed = typeof props.src === "string" && managedMediaPath.test(props.src);
  return (
    <Image
      {...props}
      unoptimized={props.unoptimized || managed}
      style={{ objectFit: "contain", objectPosition: "center", ...props.style }}
    />
  );
}
