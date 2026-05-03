import React, { useEffect, useState } from "react";
import axios from "axios";

const LatestCollection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const getImageUrl = (path) =>
    `http://localhost:5000/${path.replace(/\\/g, "/")}`;

  return (
    <section style={{ padding: "50px" }}>
      <h2 style={styles.heading}>LATEST COLLECTIONS</h2>

      <div style={styles.grid}>
        {products.map((item) => (
          <div key={item._id} style={styles.card}>
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
  heading: {
    textAlign: "center",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: "20px",
  },
  card: {
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
  },
};

export default LatestCollection;