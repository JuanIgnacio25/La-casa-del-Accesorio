import Image from "next/image";

function FooterLogo() {
  return (
    <div className="footer-main-logo">
      <div className="footer-main-logo-container">
        <Image
          src="/elbacatalini-logo-ovalado.png"
          alt="Logo-Main"
          width={500}
          height={500}
          className="footer-main-image"
          priority
        />
      </div>
    </div>
  );
}

export default FooterLogo;
