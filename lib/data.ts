// Усі дані закладу в одному місці. Позначене TODO — замінити справжніми даними з Google Maps.
export const business = {
  name: "Пічка",
  tagline: "Гаряча піца з печі — тягучий сир, тонке тісто, щедра начинка",
  phone: "+380 00 000 00 00", // TODO: справжній номер
  phoneHref: "tel:+380000000000", // TODO
  address: "м. Київ, Оболонський район", // TODO: точна адреса
  hours: [{ days: "Щодня", time: "10:00 – 22:00" }], // TODO
  googleMaps:
    "https://www.google.com/maps/place/%D0%9F%D1%96%D1%87%D0%BA%D0%B0/@50.5116387,30.4659339,18z/data=!4m6!3m5!1s0x40d4d35b2b6ad587:0xd888aa5829a5cf07!8m2!3d50.5117846!4d30.4666473!16s%2Fg%2F11mlvlt_2x",
  instagram: "https://instagram.com/", // TODO
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

export type Category = "pizza" | "snacks" | "drinks";
export const categories: { id: Category; label: string }[] = [
  { id: "pizza", label: "Піца" },
  { id: "snacks", label: "Закуски" },
  { id: "drinks", label: "Напої" },
];

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: Category;
  // для піци — ціна за кожен розмір, для решти — одна ціна
  prices: Partial<Record<Size, number>> | number;
  weight?: string;
  toppings?: Topping[]; // з чого малюється SVG піци
  icon?: "fries" | "nuggets" | "garlic" | "salad" | "cola" | "juice" | "water";
  badge?: string;
  spicy?: boolean;
};

// TODO: звірити меню та ціни з реальними
export const menu: MenuItem[] = [
  {
    id: "margherita", name: "Маргарита", category: "pizza",
    description: "Томатний соус, моцарела, свіжі томати та базилік. Класика, з якої все почалося.",
    prices: { "30": 189, "40": 279 }, toppings: ["tomato", "basil", "mozzarella"],
  },
  {
    id: "pepperoni", name: "Пепероні", category: "pizza",
    description: "Томатний соус, моцарела та багато гострої ковбаски пепероні.",
    prices: { "30": 239, "40": 339 }, toppings: ["pepperoni"], badge: "Хіт",
  },
  {
    id: "four-cheese", name: "Чотири сири", category: "pizza",
    description: "Вершковий соус, моцарела, дорблю, пармезан і чедер. Для тих, хто любить, коли тягнеться.",
    prices: { "30": 259, "40": 369 }, toppings: ["mozzarella", "blue"],
  },
  {
    id: "hawaii", name: "Гавайська", category: "pizza",
    description: "Томатний соус, моцарела, шинка та соковитий ананас.",
    prices: { "30": 229, "40": 329 }, toppings: ["ham", "pineapple"],
  },
  {
    id: "hunter", name: "Мисливська", category: "pizza",
    description: "Томатний соус, моцарела, мисливські ковбаски, бекон, цибуля та печериці.",
    prices: { "30": 249, "40": 349 }, toppings: ["bacon", "mushroom", "onion"],
  },
  {
    id: "mushroom", name: "Грибна", category: "pizza",
    description: "Вершковий соус, моцарела, печериці, цибуля та зелень.",
    prices: { "30": 219, "40": 319 }, toppings: ["mushroom", "onion", "basil"],
  },
  {
    id: "diablo", name: "Дьябло", category: "pizza",
    description: "Томатний соус, моцарела, пепероні, перець чилі та халапеньо. Гостро!",
    prices: { "30": 249, "40": 349 }, toppings: ["pepperoni", "chili", "pepper"], spicy: true,
  },
  {
    id: "veggie", name: "Овочева", category: "pizza",
    description: "Томатний соус, моцарела, болгарський перець, кукурудза, оливки, томати.",
    prices: { "30": 209, "40": 299 }, toppings: ["pepper", "corn", "olive", "tomato"], badge: "Новинка",
  },
  {
    id: "fries", name: "Картопля фрі", category: "snacks",
    description: "Хрустка, золотиста, з соусом на вибір.", prices: 89, weight: "150 г", icon: "fries",
  },
  {
    id: "nuggets", name: "Курячі нагетси", category: "snacks",
    description: "8 шматочків ніжного курячого філе в паніровці.", prices: 129, weight: "8 шт.", icon: "nuggets",
  },
  {
    id: "garlic-bread", name: "Часникові хлібці", category: "snacks",
    description: "З нашого тіста, з часниковим маслом і зеленню.", prices: 69, weight: "6 шт.", icon: "garlic",
  },
  {
    id: "caesar", name: "Цезар з куркою", category: "snacks",
    description: "Ромен, курка гриль, пармезан, грінки та соус цезар.", prices: 169, weight: "250 г", icon: "salad",
  },
  {
    id: "cola", name: "Coca-Cola", category: "drinks",
    description: "Охолоджена, 0,5 л.", prices: 45, weight: "0,5 л", icon: "cola",
  },
  {
    id: "juice", name: "Сік Sandora", category: "drinks",
    description: "Апельсин або яблуко, 0,95 л.", prices: 79, weight: "0,95 л", icon: "juice",
  },
  {
    id: "water", name: "Вода Моршинська", category: "drinks",
    description: "Негазована або слабогазована, 0,5 л.", prices: 30, weight: "0,5 л", icon: "water",
  },
];

export function priceOf(item: MenuItem, size?: Size): number | undefined {
  if (typeof item.prices === "number") return item.prices;
  return size ? item.prices[size] : undefined;
}

export const features = [
  { icon: "🔥", title: "Справжня піч", text: "Піца печеться при високій температурі — хрусткий край і м'яка середина." },
  { icon: "🧀", title: "Не шкодуємо сиру", text: "Справжня моцарела, яка тягнеться, а не «сирний продукт»." },
  { icon: "🍅", title: "Свіжі продукти", text: "Тісто замішуємо щодня, овочі та зелень — тільки свіжі." },
  { icon: "🛵", title: "Швидка доставка", text: `Привеземо гарячою за ${delivery.time}.` },
];
