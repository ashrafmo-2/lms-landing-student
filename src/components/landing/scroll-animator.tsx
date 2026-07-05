"use client";

import { useEffect } from "react";

export function ScrollAnimator() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const observedElements = new WeakSet<HTMLElement>();

    function collectRevealElements(root: ParentNode = document) {
      return Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    }

    if (prefersReducedMotion) {
      collectRevealElements().forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      },
    );

    function observeRevealElements(root: ParentNode = document) {
      collectRevealElements(root).forEach((element) => {
        if (observedElements.has(element)) return;
        observedElements.add(element);
        observer.observe(element);
      });
    }

    observeRevealElements();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;

          if (node.matches("[data-reveal]")) {
            observeRevealElements(node.parentElement ?? document);
            return;
          }

          observeRevealElements(node);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
