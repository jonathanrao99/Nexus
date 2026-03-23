/** Intersection observers for migrated HTML (`.scroll-animate` + pipeline section). */

export function initPipelineReveal(): () => void {
  const section = document.querySelector(".hardware-pipeline-section");
  if (!section) return () => {};

  const revealTargets = section.querySelectorAll(
    ".scroll-animate, .pipeline-step",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  revealTargets.forEach((el) => observer.observe(el));

  return () => {
    revealTargets.forEach((el) => observer.unobserve(el));
    observer.disconnect();
  };
}

export function initScrollAnimate(): () => void {
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  document.querySelectorAll(".scroll-animate").forEach((el) => {
    scrollObserver.observe(el);
  });

  return () => {
    scrollObserver.disconnect();
  };
}
