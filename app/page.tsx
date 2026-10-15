import { CartProvider } from "./components/Cart";
import CartDrawer from "./components/CartDrawer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import { About, Contacts, Delivery, Features, Footer } from "./components/Sections";

export default function Home() {
  return (
    <CartProvider>
      <Header />
      <main>
        <Hero />
        <Menu />
        <Features />
        <Delivery />
        <About />
        <Contacts />
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
