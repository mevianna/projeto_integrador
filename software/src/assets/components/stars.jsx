export default function StarsBackground() {
  const stars = Array.from({ length: 100 }).map(() => ({
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    size: Math.random() * 2 + 1 + "px",
    duration: Math.random() * 3 + 2 + "s",
    delay: Math.random() * 5 + "s",
  }));

  return (
    <div className="inset-0 bg-purple-950 -z-10 overflow-hidden absolute">
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animation: `twinkle ${star.duration} infinite ease-in-out`,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}
