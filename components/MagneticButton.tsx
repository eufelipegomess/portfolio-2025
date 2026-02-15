import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = "", onClick, type = "button" }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    // Changed ease to "power3.out" to remove the bouncy elastic effect
    const xTo = gsap.quickTo(button, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(button, "y", { duration: 0.5, ease: "power3.out" });
    const textXTo = gsap.quickTo(text, "x", { duration: 0.5, ease: "power3.out" });
    const textYTo = gsap.quickTo(text, "y", { duration: 0.5, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * 0.3);
      yTo(y * 0.3);
      textXTo(x * 0.1);
      textYTo(y * 0.1);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      textXTo(0);
      textYTo(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-10 h-[56px] overflow-hidden rounded-[4px] bg-[#312E35] text-white transition-colors hover:bg-[#8C6EB7] ${className}`}
    >
      <span ref={textRef} className="relative z-10 font-micro tracking-widest pointer-events-none">
        {children}
      </span>
    </button>
  );
};

export default MagneticButton;