"use client";

import { useEffect, useRef, useState } from "react";
import type { Promo } from "@/lib/types";

// 롤링창·포스터 바로 밑의 배너 박스 — 여러 장이면 자동으로 슬라이드됩니다.
// (데스크톱: 1956×168 / 모바일: 1080×320 비율)
const INTERVAL = 5000;

export default function Banner({ banners }: { banners: Promo[] }) {
  const list = (banners ?? []).filter((b) => b?.image);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = list.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % count), INTERVAL);
    return () => window.clearInterval(t);
  }, [count, paused]);

  if (count === 0) return null;
  const go = (n: number) => setIdx(((n % count) + count) % count);

  return (
    <section className="mx-auto max-w-6xl px-5 pt-5 lg:px-8">
      <div
        className="relative aspect-[1080/320] w-full overflow-hidden rounded-2xl border border-line lg:aspect-[1956/168]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {list.map((b, i) => {
            const external = /^https?:\/\//.test(b.href);
            const img = (
              <picture>
                <source media="(min-width: 1024px)" srcSet={b.image} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.mobileImage || b.image}
                  alt={b.alt}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </picture>
            );
            const cls = "block h-full w-full shrink-0";
            return b.href && b.href !== "#" ? (
              <a
                key={i}
                href={b.href}
                className={cls}
                aria-hidden={i !== idx}
                tabIndex={i === idx ? 0 : -1}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {img}
              </a>
            ) : (
              <div key={i} className={cls} aria-hidden={i !== idx}>
                {img}
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 lg:bottom-2.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}번 배너 보기`}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
