/**
 * Self-contained keyframes + reveal styles for the homepage.
 * Rendered once as a scoped <style> tag so we avoid touching the shared
 * globals.css and avoid any animation library.
 */
export function HomeStyles() {
  return (
    <style>{`
      @keyframes home-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      @keyframes home-fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: none; }
      }
      .home-float { animation: home-float 6s ease-in-out infinite; }
      .home-enter { opacity: 0; animation: home-fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

      /* Scroll reveal — toggled by the Reveal client component */
      .home-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .home-reveal[data-visible="true"] { opacity: 1; transform: none; }

      @media (prefers-reduced-motion: reduce) {
        .home-float, .home-enter { animation: none; }
        .home-reveal { opacity: 1; transform: none; transition: none; }
      }
    `}</style>
  );
}
