/**
 * Cerchio che gira attorno al logo, uguale al loader iniziale di index.html:
 * usato nelle attese tra una pagina e l'altra perche non cambi aspetto.
 */
export function LogoSpinner() {
  return (
    <div className="relative w-[140px] h-[140px] flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-[3px] border-brand-primary/15 border-t-brand-primary animate-[spin_1.2s_ease-in-out_infinite]" />
      {/* Il logo e una maschera, come nella Navbar: prende il colore del brand. */}
      <div
        role="img"
        aria-label="Stefania Mastroianni"
        className="w-[72px] h-[72px] bg-brand-primary"
        style={{
          WebkitMaskImage: "url(/images/logo.webp)",
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: "url(/images/logo.webp)",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
      />
    </div>
  );
}
