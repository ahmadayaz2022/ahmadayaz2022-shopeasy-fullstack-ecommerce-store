import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const { data } = await axios.get("http://localhost:5000/api/products");
    setProducts(data);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Product List</h2>

      {products.map((p) => (
        <div key={p._id} style={{ marginBottom: "10px" }}>
          <img
            src={`http://localhost:5000/${p.images[0]}`}
            width="50"
          />
          <span>{p.name}</span>
          <span> Rs.{p.price}</span>

          <button onClick={() => deleteProduct(p._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;