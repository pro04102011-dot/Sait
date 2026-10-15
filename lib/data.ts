// Усі дані закладу в одному місці. Позначене TODO — замінити справжніми даними з Google Maps.
export const business = {
  name: "Пічка",
  phone: "+380 00 000 00 00", // TODO: справжній номер
  phoneHref: "tel:+380000000000", // TODO
  address: "м. Київ, Оболонський район", // TODO: точна адреса
  hours: "щодня 10:00–22:00", // TODO
  googleMaps:
    "https://www.google.com/maps/place/%D0%9F%D1%96%D1%87%D0%BA%D0%B0/@50.5116387,30.4659339,18z/data=!4m6!3m5!1s0x40d4d35b2b6ad587:0xd888aa5829a5cf07!8m2!3d50.5117846!4d30.4666473!16s%2Fg%2F11mlvlt_2x",
  mapEmbed: "https://maps.google.com/maps?q=50.5117846,30.4666473&z=16&output=embed",
};

export const delivery = {
  time: "40–60 хв", // TODO
  price: 60, // TODO: вартість доставки, грн
  freeFrom: 600, // TODO: безкоштовна доставка від суми, грн
};

export type Topping =
  | "pepperoni" | "mushroom" | "olive" | "basil" | "ham" | "pineapple" | "chili"
  | "tomato" | "pepper" | "corn" | "onion" | "bacon" | "mozzarella" | "blue";

export type Size = "30" | "40";
export const sizes: { id: Size; label: string }[] = [
  { id: "30", label: "30 см" },
  { id: "40", label: "40 см" },
];

// Для конструктора «Збери свою»: ціна добавки за 30 см (40 см — у 1,5 раза дорожче)
export const toppingInfo: Record<Topping, { label: string; price: number }> = {
  pepperoni: { label: "Пепероні", price: 45 },
  bacon: { label: "Бекон", price: 45 },
  ham: { label: "Шинка", price: 40 },
  mushroom: { label: "Печериці", price: 30 },
  mozzarella: { label: "Моцарела", price: 40 },
  blue: { label: "Дорблю", price: 50 },
  tomato: { label: "Томати", price: 25 },
  pepper: { label: "Перець", price: 25 },
  olive: { label: "Оливки", price: 30 },
  corn: { label: "Кукурудза", price: 20 },
  pineapple: { label: "Ананас", price: 30 },
  onion: { label: "Цибуля", price: 15 },
  chili: { label: "Чилі", price: 15 },
  basil: { label: "Базилік", price: 15 },
};
export const builder = {
  base: { "30": 149, "40": 219 } as Record<Size, number>, // тісто + соус + моцарела
  maxToppings: 6,
};
export const toppingPrice = (t: Topping, size: Size) =>
  size === "40" ? Math.round((toppingInfo[t].price * 1.5) / 5) * 5 : toppingInfo[t].price;

export type Pizza = {
  id: string;
  name: string;
  description: string;
  prices: Record<Size, number>;
  toppings: Topping[];
  tag?: string;
};

// TODO: звірити меню та ціни з реальними
export const pizzas: Pizza[] = [
  { id: "margherita", name: "Маргарита", prices: { "30": 189, "40": 279 }, toppings: ["tomato", "basil", "mozzarella"],
    description: "Томатний соус, моцарела, свіжі томати й базилік. Піца, з якої все почалося." },
  { id: "pepperoni", name: "Пепероні", prices: { "30": 239, "40": 339 }, toppings: ["pepperoni"], tag: "хіт",
    description: "Томатний соус, моцарела і пепероні, що закручується в хрусткі «чашечки»." },
  { id: "four-cheese", name: "Чотири сири", prices: { "30": 259, "40": 369 }, toppings: ["mozzarella", "blue"],
    description: "Вершковий соус, моцарела, дорблю, пармезан і чедер. Тягнеться до самої тарілки." },
  { id: "hunter", name: "Мисливська", prices: { "30": 249, "40": 349 }, toppings: ["bacon", "mushroom", "onion"],
    description: "Мисливські ковбаски, бекон, печериці й цибуля. Ситна, як вечеря після тренування." },
  { id: "diablo", name: "Дьябло", prices: { "30": 249, "40": 349 }, toppings: ["pepperoni", "chili", "pepper"], tag: "гостра",
    description: "Пепероні, чилі та халапеньо. Попереджали — не скаржтесь." },
  { id: "hawaii", name: "Гавайська", prices: { "30": 229, "40": 329 }, toppings: ["ham", "pineapple"],
    description: "Шинка й ананас. Вічна суперечка — а ви за чи проти?" },
  { id: "mushroom", name: "Грибна", prices: { "30": 219, "40": 319 }, toppings: ["mushroom", "onion", "basil"],
    description: "Вершковий соус, моцарела, печериці, цибуля та зелень." },
  { id: "veggie", name: "Городня", prices: { "30": 209, "40": 299 }, toppings: ["pepper", "corn", "olive", "tomato"], tag: "новинка",
    description: "Перець, кукурудза, оливки й томати — кольорова, як грядка в серпні." },
];

export type Extra = {
  id: string;
  name: string;
  note: string;
  price: number;
  icon: "fries" | "nuggets" | "garlic" | "salad" | "cola" | "juice" | "water";
};

export const extras: Extra[] = [
  { id: "fries", name: "Картопля фрі", note: "150 г, соус на вибір", price: 89, icon: "fries" },
  { id: "nuggets", name: "Нагетси", note: "8 шт.", price: 129, icon: "nuggets" },
  { id: "garlic-bread", name: "Часникові хлібці", note: "6 шт., з нашого тіста", price: 69, icon: "garlic" },
  { id: "caesar", name: "Цезар з куркою", note: "250 г", price: 169, icon: "salad" },
  { id: "cola", name: "Coca-Cola", note: "0,5 л", price: 45, icon: "cola" },
  { id: "juice", name: "Сік Sandora", note: "0,95 л", price: 79, icon: "juice" },
  { id: "water", name: "Моршинська", note: "0,5 л", price: 30, icon: "water" },
];

// Рядок кошика: готова піца, своя піца (id "custom") або закуска/напій
export type CartLine = { id: string; size?: Size; toppings?: Topping[]; qty: number };

export const isTopping = (t: unknown): t is Topping => typeof t === "string" && t in toppingInfo;
export const isSize = (s: unknown): s is Size => s === "30" || s === "40";

// Єдина функція ціни — нею рахує і браузер, і сервер
export function linePrice(l: Omit<CartLine, "qty">): number | undefined {
  if (l.id === "custom") {
    if (!isSize(l.size) || !l.toppings || l.toppings.length > builder.maxToppings) return undefined;
    if (!l.toppings.every(isTopping) || new Set(l.toppings).size !== l.toppings.length) return undefined;
    return builder.base[l.size] + l.toppings.reduce((s, t) => s + toppingPrice(t, l.size!), 0);
  }
  const pizza = pizzas.find((p) => p.id === l.id);
  if (pizza) return isSize(l.size) ? pizza.prices[l.size] : undefined;
  return extras.find((e) => e.id === l.id)?.price;
}

export function lineName(l: Omit<CartLine, "qty">): string {
  if (l.id === "custom") return "Своя піца";
  return pizzas.find((p) => p.id === l.id)?.name ?? extras.find((e) => e.id === l.id)?.name ?? "?";
}

export const lineKey = (l: Omit<CartLine, "qty">) => `${l.id}|${l.size ?? ""}|${(l.toppings ?? []).join(",")}`;
