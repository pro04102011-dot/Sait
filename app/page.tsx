import { CartProvider } from "./components/Cart";
import CartDrawer from "./components/CartDrawer";
import Header from "./components/Header";
import OvenHero from "./components/OvenHero";
import Marquee from "./components/Marquee";
import PizzaDial from "./components/PizzaDial";
import Builder from "./components/Builder";
import { Extras, Footer, Info } from "./components/Sections";

export default function Home() {
  return (
    <CartProvider>
      <Header />
      <main>
        <OvenHero />
        <Marquee words={["гаряча", "тягуча", "хрустка", "з печі", "з любов'ю"]} />
        <PizzaDial />
        <Builder />
        <Marquee words={["доставка 40–60 хв", "самовивіз", "30 і 40 см", "без компромісів"]} reverse tone="cream" />
        <Extras />
        <Info />
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
