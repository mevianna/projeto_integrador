/**
 * @file stars.jsx
 * @fileoverview Componente responsável por renderizar um fundo animado de estrelas.
 *
 * Este componente gera 100 estrelas com posições, tamanhos e animações aleatórias,
 * criando um efeito visual de cintilação no plano de fundo da página.
 *
 * @version 1.0.0
 * @date 2025-08-29
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartare@gmail.com>
 *
 * Este componente gera 100 estrelas com posições, tamanhos e animações aleatórias,
 * criando um efeito visual de cintilação no plano de fundo da página.
 *
 * @component
 *
 * @returns {JSX.Element} Um container absoluto contendo múltiplas estrelas animadas.
 *
 * @example
 * // Uso simples:
 * <StarsBackground />
 */
export default function StarsBackground() {
  /**
   * Lista de estrelas geradas aleatoriamente.
   * Cada estrela possui:
   * - posição vertical (`top`)
   * - posição horizontal (`left`)
   * - tamanho (`size`)
   * - duração da animação (`duration`)
   * - tempo inicial de atraso (`delay`)
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
