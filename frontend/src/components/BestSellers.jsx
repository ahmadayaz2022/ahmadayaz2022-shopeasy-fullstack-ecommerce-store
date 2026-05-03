import React, { useEffect, useState } from "react";
import axios from "axios";

const BestSellers = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("http://localhost:5000/api/products");
      const best = data.filter((item) => item.bestseller);
      setProducts(best);
    };

    fetchProducts();
  }, []);

  const getImageUrl = (path) =>
    `http://localhost:5000/${path.replace(/\\/g, "/")}`;

  return (
    <section style={{ padding: "50px" }}>
      <h2 style={{ textAlign: "center" }}>BEST SELLERS</h2>

      <div style={styles.grid}>
        {products.map((item) => (
          <div key={item._id}>
            <img
              src={getImageUrl(item.images[0])}
              alt={item.name}
              style={styles.image}
            />
            <h4>{item.name}</h4>
            <p>Rs. {item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  image: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
  },
};

export default BestSellers;