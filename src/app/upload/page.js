"use client";
export default function page() {
  const products = [
    {
      name: "Musk Alathara Black",
      code: "A001",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Purity Musk",
      code: "A002",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Red Musk",
      code: "A003",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Musk Almasaa",
      code: "A004",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Raspberry Musk",
      code: "A006",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "The Splendor of Musk",
      code: "M051",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Musk Alathara",
      code: "A007",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Cherry Musk",
      code: "A008",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Bridal/Spring Musk",
      code: "A009",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Bridal Musk",
      code: "A010",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Black Musk",
      code: "A011",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Night Musk",
      code: "A012",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "YSLE Musk",
      code: "A013",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Caramel Musk",
      code: "A014",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Apple Musk",
      code: "A015",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Powder Musk",
      code: "A016",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Powder/Alathara rose Musk",
      code: "A017",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Royal Musk",
      code: "A018",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Alnkab Musk",
      code: "A019",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Royal Oud",
      code: "A020",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Golden Oud",
      code: "A021",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Oud Mubkhar",
      code: "A022",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Oud OV/Oil",
      code: "A023",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Velvet Oud",
      code: "A024",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Kalemat Oud",
      code: "A025",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Elie Saab",
      code: "A026",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Gold Dust",
      code: "A027",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Shaikh Alshoykh Anbar",
      code: "A028",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Rumz Alrasasi",
      code: "A029",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Any Nishan",
      code: "A030",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Mukhlkat Volcano",
      code: "A031",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Vanilla",
      code: "A032",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Incense 73",
      code: "A033",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Gulf Mix",
      code: "A034",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Ana Walshoq",
      code: "A035",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Dove",
      code: "A036",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Fa Sapon",
      code: "A037",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Coconut",
      code: "A038",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Lemon Flower",
      code: "A039",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Prayers for Heaven",
      code: "A040",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Sultan 's Harem",
      code: "A041",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Zahrat Alkhaleej",
      code: "A042",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Oud Madawi",
      code: "A043",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Tulip Flower",
      code: "A044",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
    {
      name: "Rose",
      code: "A045",
      sizes: [
        { name: "30ml", price: 5 },
        { name: "50ml", price: 15 },
        { name: "100ml", price: 35 },
        { name: "5ml(Duftöl)", price: 0 },
        { name: "10ml(Duftöl)", price: 5 },
      ],
      price: 10,
      stock: 72,
    },
  ];

  // Category ID
  const categoryId = "67883afe580396a5ddc0caf1";

  // Function to post all products
  async function postProducts() {
    for (const product of products) {
      const productWithCategory = {
        ...product,
        category: categoryId,
      };

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productWithCategory),
        });

        if (!response.ok) {
          throw new Error(`Failed to create product: ${product.name}`);
        }

        const result = await response.json();
        console.log("Product created:", result);
      } catch (error) {
        console.error(error.message);
      }
    }
  }
  return (
    <div>
      <button onClick={() => postProducts()}>Upload</button>
    </div>
  );
}
