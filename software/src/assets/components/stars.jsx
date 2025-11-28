/**
 * @file stars.jsx
 * @fileoverview Component responsible for rendering an animated star background.
 *
 * @version 1.0.0
 * @date 2025-08-29
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 *
 * @license Proprietary
 *
 * @description
 * This component generates 100 stars with random positions, sizes, and animations,
 * creating a twinkling visual effect in the page background.
 *
 * @component
 *
 * @returns {JSX.Element} An absolute container containing multiple animated stars.
 *
 * @example
 * // Simple usage:
 * <StarsBackground />
 */

export default function StarsBackground() {
  /**
   * List of randomly generated stars.
   * Each star contains:
   * - vertical position (`top`)
   * - horizontal position (`left`)
   * - size (`size`)
   * - animation duration (`duration`)
   * - initial delay time (`delay`)
   *
   * @type {Array<{
   *   top: string,
   *   left: string,
   *   size: string,
   *   duration: string,
   *   delay: string
   * }>}
   */

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
