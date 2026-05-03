import React from "react";

const Newsletter = () => {
  return (
    <div style={styles.wrapper}>
      <h2>Subscribe now & get 20% off</h2>
      <p>Stay updated with our latest fashion products.</p>

      <div style={styles.form}>
        <input type="email" placeholder="Enter your email" style={styles.input} />
        <button style={styles.button}>SUBSCRIBE</button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    textAlign: "center",
    padding: "60px 20px",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  input: {
    padding: "15px",
    width: "350px",
  },
  button: {
    padding: "15px 30px",
  },
};

export default Newsletter;