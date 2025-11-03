"use client";

import { useEffect, useState } from "react";
import type { FormBlock } from "@/types";

interface YouTubeBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function YouTubeBlock({ block }: YouTubeBlockProps) {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    const url = (block.url as string) || block.label || "";
    const id = extractYouTubeId(url);
    setVideoId(id);
  }, [block]);

  if (!videoId) {
    return (
      <div className="p-6 bg-muted/50 rounded-[14px] border-2 border-dashed border-muted-foreground/20 text-center">
        <p className="text-sm text-muted-foreground">URL YouTube invalide</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-[14px] overflow-hidden border-2 border-border shadow-md">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={block.label || "Vidéo YouTube"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

