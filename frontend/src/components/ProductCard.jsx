import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="card">
      <Link to={`/product/${product._id}`}>
        <img src={`http://localhost:5000/${product.images[0]}`} />
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </Link>
    </div>
  );
};

export default ProductCard;