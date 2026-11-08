"use client";

import * as React from "react";
import { clsx } from "clsx";
import {
  AnimatePresence,
  LazyMotion,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";

import { focarSecao } from "@/lib/foco";

/**
 * Navegação flutuante de um artigo: mostra a seção atual e o progresso da
 * leitura num anel; ao abrir, lista as seções para pular entre elas.
 * Visual adaptado ao design system do Confere Fatos (barra preta, rótulo em
 * caixa alta, anel rosa, sem sombra).
 */

export type ScrollProgressSection = { id: string; label: string };

const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const SIZE_SPRING = { type: "spring", bounce: 0.16, duration: 0.5 } as const;
const LABEL_CROSSFADE = { duration: 0.22, ease: EASE_OUT } as const;
const LAYER_FADE = { duration: 0.24, ease: EASE_IN_OUT } as const;

/**
 * Raio dos cantos. O design system do Confere Fatos não usa cantos
 * arredondados; para voltar à pílula, troque RAIO_FECHADO por `null`
 * (meia altura) e RAIO_ABERTO por 26.
 */
const RAIO_FECHADO: number | null = 0;
const RAIO_ABERTO = 0;

/** Recursos de animação (layout, layoutId) carregados depois da hidratação. */
const carregarRecursos = () => import("./recursos-motion").then((r) => r.default);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type Size = { width: number; height: number };

export type ScrollProgressProps = React.ComponentProps<"nav"> & {
  sections?: ScrollProgressSection[];
  containerRef?: React.RefObject<HTMLElement | null>;
  offset?: number;
};

const CLASSE_ITEM = "tipo-rotulo flex items-center gap-3 px-3 py-2.5 text-xs leading-none";
const FOCO = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rosa";

const ScrollProgress = ({
  className,
  sections = [],
  containerRef,
  offset = 120,
  onBlur,
  ...props
}: ScrollProgressProps) => {
  const layoutId = React.useId();
  const listaId = React.useId();
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll(
    containerRef ? { container: containerRef } : undefined,
  );
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // O anel é pintado direto a partir do valor de progresso, sem depender dos
  // recursos do motion carregados depois: assim ele já aparece certo quando a
  // página abre rolada (por âncora) e quando a barra reaparece após fechar a lista.
  const anelRef = React.useRef<SVGCircleElement | null>(null);
  const pintarAnel = React.useCallback((valor: number) => {
    const fracao = Math.min(1, Math.max(0, valor));
    anelRef.current?.setAttribute("stroke-dasharray", `${fracao} 1`);
  }, []);
  useMotionValueEvent(progress, "change", pintarAnel);
  const montarAnel = React.useCallback(
    (el: SVGCircleElement | null) => {
      anelRef.current = el;
      if (el) pintarAnel(progress.get());
    },
    [pintarAnel, progress],
  );

  const [activeId, setActiveId] = React.useState<string | undefined>(sections[0]?.id);
  const [open, setOpen] = React.useState(false);

  const scrollLock = React.useRef(false);
  const scrollLockTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  /** Ao fechar a lista pelo teclado ou pelo botão, o foco volta para a barra. */
  const devolverFoco = React.useRef(false);

  React.useEffect(() => {
    const scroller = containerRef?.current ?? window;

    const update = () => {
      if (scrollLock.current) return;
      const el = containerRef?.current;
      const altura = el ? el.scrollHeight : document.documentElement.scrollHeight;
      const visivel = el ? el.clientHeight : window.innerHeight;
      const rolado = el ? el.scrollTop : window.scrollY;
      // No fim da página a última seção pode não alcançar a linha de referência.
      if (altura > visivel + 2 && rolado + visivel >= altura - 2) {
        setActiveId(sections.at(-1)?.id);
        return;
      }
      const anchor = (el?.getBoundingClientRect().top ?? 0) + offset;
      const active = sections.findLast(({ id }) => {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        return top !== undefined && top <= anchor;
      });
      setActiveId(active?.id ?? sections[0]?.id);
    };

    // Primeira leitura no próximo quadro, depois da pintura inicial.
    const quadro = requestAnimationFrame(update);
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(quadro);
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections, containerRef, offset]);

  const label = sections.find((s) => s.id === activeId)?.label;

  const collapsedRef = React.useRef<HTMLDivElement>(null);
  const openRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const rootRef = React.useRef<HTMLElement>(null);
  const surfaceRef = React.useRef<HTMLDivElement>(null);

  const [collapsedSize, setCollapsedSize] = React.useState<Size>();
  const [openSize, setOpenSize] = React.useState<Size>();
  const [labelWidth, setLabelWidth] = React.useState<number>();

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (labelRef.current) setLabelWidth(labelRef.current.offsetWidth);
      if (collapsedRef.current) {
        setCollapsedSize({
          width: collapsedRef.current.offsetWidth,
          height: collapsedRef.current.offsetHeight,
        });
      }
      if (openRef.current) {
        setOpenSize({
          width: openRef.current.offsetWidth,
          height: openRef.current.offsetHeight,
        });
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (labelRef.current) ro.observe(labelRef.current);
    if (collapsedRef.current) ro.observe(collapsedRef.current);
    if (openRef.current) ro.observe(openRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [sections]);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      devolverFoco.current = !!rootRef.current?.contains(document.activeElement);
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Ao abrir, o foco vai para o item da seção atual; ao fechar pelo teclado,
  // volta para a barra. Os dois são montados por AnimatePresence, então o foco
  // é aplicado no quadro seguinte.
  React.useEffect(() => {
    const quadro = requestAnimationFrame(() => {
      const superficie = surfaceRef.current;
      if (!superficie) return;
      if (open) {
        superficie.querySelector<HTMLElement>('[aria-current="true"]')?.focus();
      } else if (devolverFoco.current) {
        devolverFoco.current = false;
        superficie.querySelector<HTMLElement>("[data-scroll-progress-toggle]")?.focus();
      }
    });
    return () => cancelAnimationFrame(quadro);
  }, [open]);

  React.useEffect(() => () => clearTimeout(scrollLockTimer.current), []);

  const fechar = () => {
    devolverFoco.current = true;
    setOpen(false);
  };

  const selectSection = (id: string) => {
    scrollLock.current = true;
    clearTimeout(scrollLockTimer.current);
    scrollLockTimer.current = setTimeout(
      () => {
        scrollLock.current = false;
      },
      reduceMotion ? 0 : 700,
    );

    setActiveId(id);
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
    focarSecao(id);
  };

  const size = open ? openSize : collapsedSize;
  const radius = open ? RAIO_ABERTO : (RAIO_FECHADO ?? (collapsedSize?.height ?? 32) / 2);
  const entrada = { opacity: 0, filter: reduceMotion ? undefined : "blur(4px)" };

  return (
    <nav
      ref={rootRef}
      aria-label="Seções do artigo"
      data-slot="scroll-progress"
      className={clsx("fixed bottom-6 left-1/2 z-50 -translate-x-1/2 print:hidden", className)}
      {...props}
      onBlur={(e) => {
        onBlur?.(e);
        // Lista aberta e foco saindo do componente (Tab): fecha sem puxar o foco de volta.
        const destino = e.relatedTarget as Node | null;
        if (open && destino && !e.currentTarget.contains(destino)) setOpen(false);
      }}
    >
      {/* Medidas da barra e da lista, com a borda de 2px incluída. */}
      <div className="pointer-events-none invisible absolute" aria-hidden>
        <div ref={collapsedRef} className="inline-flex items-center gap-2.5 border-2 py-2 pl-2.5 pr-4">
          <span className="h-5 w-5" />
          <span ref={labelRef} className="tipo-rotulo whitespace-nowrap text-xs leading-none">
            {label}
          </span>
        </div>
        <div ref={openRef} className="w-max border-2 p-1.5">
          <div className={CLASSE_ITEM}>
            <span className="h-1.5 w-1.5" />
            <span className="whitespace-nowrap">Fechar seções</span>
          </div>
          {sections.map((s) => (
            <div key={s.id} className={CLASSE_ITEM}>
              <span className="h-1.5 w-1.5" />
              <span className="whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <LazyMotion features={carregarRecursos} strict>
        {size && (
          <m.div
            ref={surfaceRef}
            data-slot="scroll-progress-surface"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden border-2 border-papel bg-tinta text-papel"
            style={{ maxHeight: "calc(100dvh - 3rem)" }}
            initial={false}
            animate={{
              width: size.width,
              height: size.height,
              borderRadius: radius,
            }}
            transition={reduceMotion ? { duration: 0 } : SIZE_SPRING}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {open ? (
                <m.div
                  key="list"
                  className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain p-1.5"
                  initial={entrada}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={entrada}
                  transition={LAYER_FADE}
                >
                  <button
                    type="button"
                    aria-expanded={true}
                    aria-controls={listaId}
                    onClick={fechar}
                    className={clsx(CLASSE_ITEM, "w-full text-left text-papel/60 hover:text-papel/85", FOCO)}
                  >
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0" />
                    <span className="whitespace-nowrap">Fechar seções</span>
                  </button>
                  <ul id={listaId} role="list" className="flex flex-col">
                    {sections.map((s, i) => {
                      const isActive = s.id === activeId;
                      const atraso = { duration: 0.3, ease: EASE_IN_OUT, delay: reduceMotion ? 0 : 0.04 + i * 0.03 };
                      const entradaItem = reduceMotion ? undefined : { opacity: 0, y: 4, filter: "blur(3px)" };
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => selectSection(s.id)}
                            aria-current={isActive ? "true" : undefined}
                            className={clsx(
                              CLASSE_ITEM,
                              "relative w-full text-left transition-colors",
                              isActive ? "text-papel" : "text-papel/60 hover:text-papel/85",
                              FOCO,
                            )}
                            style={{ borderRadius: RAIO_ABERTO }}
                          >
                            {isActive && (
                              <m.span
                                layoutId={`${layoutId}-active`}
                                className="absolute inset-0 bg-papel/10"
                                style={{ borderRadius: RAIO_ABERTO }}
                                transition={reduceMotion ? { duration: 0 } : SIZE_SPRING}
                              />
                            )}
                            <m.span
                              aria-hidden
                              className={clsx("relative h-1.5 w-1.5 shrink-0", isActive ? "bg-rosa" : "bg-papel/35")}
                              initial={entradaItem}
                              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              transition={atraso}
                            />
                            <m.span
                              className="relative whitespace-nowrap"
                              initial={entradaItem}
                              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              transition={atraso}
                            >
                              {s.label}
                            </m.span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </m.div>
              ) : (
                <m.button
                  key="pill"
                  type="button"
                  data-scroll-progress-toggle
                  onClick={() => setOpen(true)}
                  aria-expanded={false}
                  aria-label={label ? `Seções do artigo. Agora em: ${label}` : "Seções do artigo"}
                  className={clsx(
                    "absolute inset-0 flex items-center gap-2.5 py-2 pl-2.5 pr-4",
                    "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-rosa",
                  )}
                  initial={entrada}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={entrada}
                  transition={LAYER_FADE}
                >
                  <span className="shrink-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 -rotate-90" aria-hidden>
                      <circle cx="12" cy="12" r="10" fill="none" strokeWidth="2.5" className="stroke-papel/20" />
                      <circle
                        ref={montarAnel}
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        strokeWidth="2.5"
                        pathLength={1}
                        strokeDasharray="0 1"
                        className="stroke-rosa"
                      />
                    </svg>
                  </span>

                  <span className="relative h-5 shrink-0" style={{ width: labelWidth }}>
                    <AnimatePresence initial={false}>
                      {label && (
                        <m.span
                          key={label}
                          data-slot="scroll-progress-label"
                          className="tipo-rotulo absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-xs leading-none text-papel"
                          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(1.5px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(1.5px)" }}
                          transition={LABEL_CROSSFADE}
                        >
                          {label}
                        </m.span>
                      )}
                    </AnimatePresence>
                  </span>
                </m.button>
              )}
            </AnimatePresence>
          </m.div>
        )}
      </LazyMotion>
    </nav>
  );
};

export { ScrollProgress };
export default ScrollProgress;
